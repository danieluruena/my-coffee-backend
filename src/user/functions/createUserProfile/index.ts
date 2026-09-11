import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { loadEnvironment } from '../../../shared/config/environment'
import { createDynamoDbClient } from '../../../shared/infrastructure/aws/clients'
import type { HttpLambdaResponse } from '../../../shared/interfaces'
import {
  createUserProfile,
  type CreateUserProfileRequest,
  type UserProfileRepository,
} from '../../application/createUserProfile'
import { DynamoDbUserProfileRepository } from '../../infrastructure/dynamoDbUserProfileRepository'

export interface UserProfileHandlerEvent {
  body?: string
  requestContext?: {
    authorizer?: {
      lambda?: {
        subject?: string
        email?: string
        name?: string
      }
    }
  }
}

const buildRepository = (): UserProfileRepository => {
  const config = loadEnvironment()
  const client = DynamoDBDocumentClient.from(createDynamoDbClient(config))
  return new DynamoDbUserProfileRepository(client, config.tableName)
}

const response = (statusCode: number, payload: Record<string, unknown>): HttpLambdaResponse => ({
  statusCode,
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify(payload),
})

const isAuthenticated = (event: UserProfileHandlerEvent): string | undefined => {
  return event.requestContext?.authorizer?.lambda?.subject?.trim() || undefined
}

const isUserProfileRepository = (
  value: UserProfileRepository | undefined,
): value is UserProfileRepository => {
  return typeof value?.createIfNotExists === 'function'
}

export const handler = async (
  event: UserProfileHandlerEvent,
  repositoryOrContext?: UserProfileRepository,
): Promise<HttpLambdaResponse> => {
  const userId = isAuthenticated(event)

  if (!userId) {
    return response(401, { message: 'Unauthorized' })
  }

  if (!event.body) {
    return response(400, { message: 'Request body is required' })
  }

  const repository = isUserProfileRepository(repositoryOrContext)
    ? repositoryOrContext
    : buildRepository()

  try {
    const payload = JSON.parse(event.body) as Partial<CreateUserProfileRequest>
    const result = await createUserProfile(
      {
        email: payload.email ?? '',
        displayName: payload.displayName ?? '',
        avatarUrl: payload.avatarUrl,
      },
      userId,
      repository,
    )

    if (!result.created) {
      return response(200, {
        user: {
          id: result.profile.userId,
          email: result.profile.email,
          displayName: result.profile.displayName,
          ...(result.profile.avatarUrl ? { avatarUrl: result.profile.avatarUrl } : {}),
          createdAt: result.profile.createdAt,
          updatedAt: result.profile.updatedAt,
        },
      })
    }

    return response(201, {
      user: {
        id: result.profile.userId,
        email: result.profile.email,
        displayName: result.profile.displayName,
        ...(result.profile.avatarUrl ? { avatarUrl: result.profile.avatarUrl } : {}),
        createdAt: result.profile.createdAt,
        updatedAt: result.profile.updatedAt,
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('required') || error.message.includes('invalid')) {
        return response(400, { message: error.message })
      }
    }

    console.error('Failed to create user profile', error)
    return response(500, { message: 'Internal server error' })
  }
}

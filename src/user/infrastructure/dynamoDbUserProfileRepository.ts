import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb'
import type {
  UserProfileCreationResult,
  UserProfileRepository,
} from '../application/interfaces'
import type { UserSettings } from '../domain/models'

const PROFILE_SORT_KEY = 'SETTINGS#PROFILE' as const

type UserProfileItem = Omit<UserSettings, 'pk' | 'sk'> & {
  PK: string
  SK: typeof PROFILE_SORT_KEY
}

const userPartitionKey = (userId: string): string => `USER#${userId}`

const toDomainProfile = (item: UserProfileItem): UserSettings => {
  const { PK, SK, ...profile } = item

  return {
    ...profile,
    pk: PK,
    sk: SK,
  }
}

export class DynamoDbUserProfileRepository implements UserProfileRepository {
  public constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  public async findByUserId(userId: string): Promise<UserSettings | undefined> {
    const response = await this.client.send(new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: userPartitionKey(userId),
        SK: PROFILE_SORT_KEY,
      },
    }))

    return response.Item
      ? toDomainProfile(response.Item as UserProfileItem)
      : undefined
  }

  public async createIfNotExists(
    profile: UserSettings,
  ): Promise<UserProfileCreationResult> {
    const storedProfile: UserProfileItem = {
      userId: profile.userId,
      email: profile.email,
      displayName: profile.displayName,
      ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      PK: userPartitionKey(profile.userId),
      SK: PROFILE_SORT_KEY,
    }

    try {
      await this.client.send(new PutCommand({
        TableName: this.tableName,
        Item: storedProfile,
        ConditionExpression: 'attribute_not_exists(PK)',
      }))

      return { created: true, profile: toDomainProfile(storedProfile) }
    } catch (error: unknown) {
      if (!(error instanceof Error) || error.name !== 'ConditionalCheckFailedException') {
        throw error
      }

      const existingProfile = await this.findByUserId(profile.userId)

      if (!existingProfile) {
        throw error
      }

      return { created: false, profile: existingProfile }
    }
  }
}

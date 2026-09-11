import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb'
import { DynamoDbUserProfileRepository } from '../../../src/user/infrastructure/dynamoDbUserProfileRepository'
import type { UserSettings } from '../../../src/user/application/createUserProfile'

describe('DynamoDbUserProfileRepository', () => {
  const profile: UserSettings = {
    pk: 'USER#cognito-sub',
    sk: 'SETTINGS#PROFILE',
    userId: 'cognito-sub',
    email: 'coffee@example.test',
    displayName: 'Coffee User',
    createdAt: '2026-09-09T03:00:00.000Z',
    updatedAt: '2026-09-09T03:00:00.000Z',
  }

  test('creates a profile with canonical user keys', async () => {
    const send = jest.fn().mockResolvedValue({})
    const repository = new DynamoDbUserProfileRepository(
      { send } as unknown as DynamoDBDocumentClient,
      'coffee-table',
    )

    const result = await repository.createIfNotExists(profile)

    expect(result).toEqual({ created: true, profile })
    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.calls[0][0]).toBeInstanceOf(PutCommand)
    expect(send.mock.calls[0][0].input).toMatchObject({
      TableName: 'coffee-table',
      Item: {
        PK: 'USER#cognito-sub',
        SK: 'SETTINGS#PROFILE',
      },
    })
  })

  test('finds a profile by user id', async () => {
    const send = jest.fn().mockResolvedValue({
      Item: {
        PK: 'USER#cognito-sub',
        SK: 'SETTINGS#PROFILE',
        userId: profile.userId,
        email: profile.email,
        displayName: profile.displayName,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    })
    const repository = new DynamoDbUserProfileRepository(
      { send } as unknown as DynamoDBDocumentClient,
      'coffee-table',
    )

    await expect(repository.findByUserId('cognito-sub')).resolves.toEqual(profile)
    expect(send.mock.calls[0][0]).toBeInstanceOf(GetCommand)
    expect(send.mock.calls[0][0].input).toMatchObject({
      TableName: 'coffee-table',
      Key: {
        PK: 'USER#cognito-sub',
        SK: 'SETTINGS#PROFILE',
      },
    })
  })

  test('returns the existing profile after a conditional conflict', async () => {
    const conflict = new Error('profile exists')
    conflict.name = 'ConditionalCheckFailedException'
    const send = jest.fn()
      .mockRejectedValueOnce(conflict)
      .mockResolvedValueOnce({
        Item: {
          PK: 'USER#cognito-sub',
          SK: 'SETTINGS#PROFILE',
          userId: profile.userId,
          email: profile.email,
          displayName: profile.displayName,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
      })
    const repository = new DynamoDbUserProfileRepository(
      { send } as unknown as DynamoDBDocumentClient,
      'coffee-table',
    )

    await expect(repository.createIfNotExists(profile)).resolves.toEqual({
      created: false,
      profile,
    })
    expect(send).toHaveBeenCalledTimes(2)
  })
})

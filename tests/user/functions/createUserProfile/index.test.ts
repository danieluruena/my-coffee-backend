import { handler } from '../../../../src/user/functions/createUserProfile'
import type { UserProfileRepository } from '../../../../src/user/application/createUserProfile'

describe('user profile handler', () => {
  const profileRepository: UserProfileRepository = {
    findByUserId: jest.fn(),
    createIfNotExists: jest.fn().mockResolvedValue({
      created: true,
      profile: {
        pk: 'USER#sub-123',
        sk: 'SETTINGS#PROFILE',
        userId: 'sub-123',
        email: 'coffee@example.test',
        displayName: 'Coffee User',
        avatarUrl: 'https://example.test/avatar.png',
        createdAt: '2026-09-09T03:00:00.000Z',
        updatedAt: '2026-09-09T03:00:00.000Z',
      },
    }),
  }

  test('returns 201 with the created profile when the body is valid', async () => {
    const response = await handler({
      body: JSON.stringify({
        email: 'coffee@example.test',
        displayName: 'Coffee User',
        avatarUrl: 'https://example.test/avatar.png',
      }),
      requestContext: {
        authorizer: {
          lambda: {
            subject: 'sub-123',
            email: 'coffee@example.test',
            name: 'Coffee User',
          },
        },
      },
    }, profileRepository)

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body)).toEqual({
      user: {
        id: 'sub-123',
        email: 'coffee@example.test',
        displayName: 'Coffee User',
        avatarUrl: 'https://example.test/avatar.png',
        createdAt: '2026-09-09T03:00:00.000Z',
        updatedAt: '2026-09-09T03:00:00.000Z',
      },
    })
  })

  test('returns 401 when the request has no authenticated subject', async () => {
    const response = await handler({
      body: JSON.stringify({
        email: 'coffee@example.test',
        displayName: 'Coffee User',
      }),
      requestContext: {
        authorizer: {},
      },
    }, profileRepository)

    expect(response.statusCode).toBe(401)
    expect(JSON.parse(response.body)).toEqual({ message: 'Unauthorized' })
  })

  test('returns 409 when the profile already exists', async () => {
    const existingProfileRepository: UserProfileRepository = {
      findByUserId: jest.fn(),
      createIfNotExists: jest.fn().mockResolvedValue({
        created: false,
        profile: {
          pk: 'USER#sub-123',
          sk: 'SETTINGS#PROFILE',
          userId: 'sub-123',
          email: 'coffee@example.test',
          displayName: 'Coffee User',
          createdAt: '2026-09-09T03:00:00.000Z',
          updatedAt: '2026-09-09T03:00:00.000Z',
        },
      }),
    }

    const response = await handler({
      body: JSON.stringify({
        email: 'coffee@example.test',
        displayName: 'Coffee User',
      }),
      requestContext: {
        authorizer: {
          lambda: { subject: 'sub-123' },
        },
      },
    }, existingProfileRepository)

    expect(response.statusCode).toBe(409)
    expect(JSON.parse(response.body)).toEqual({
      message: 'User profile already exists',
    })
  })
})

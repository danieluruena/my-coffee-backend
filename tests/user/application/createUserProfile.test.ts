import { createUserProfile } from '../../../src/user/application/createUserProfile'
import type { UserProfileRepository } from '../../../src/user/application/interfaces'

describe('createUserProfile', () => {
  const createdAt = '2026-09-09T03:00:00.000Z'

  test('creates a profile from the authenticated identity and request body', async () => {
    const repository: UserProfileRepository = {
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
          createdAt,
          updatedAt: createdAt,
        },
      }),
    }

    const result = await createUserProfile(
      {
        email: ' Coffee@Example.test ',
        displayName: ' Coffee User ',
        avatarUrl: ' https://example.test/avatar.png ',
      },
      'sub-123',
      repository,
    )

    expect(result.created).toBe(true)
    expect(result.profile).toMatchObject({
      userId: 'sub-123',
      email: 'coffee@example.test',
      displayName: 'Coffee User',
      avatarUrl: 'https://example.test/avatar.png',
    })
    expect(repository.createIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({
        pk: 'USER#sub-123',
        sk: 'SETTINGS#PROFILE',
        userId: 'sub-123',
        email: 'coffee@example.test',
        displayName: 'Coffee User',
      }),
    )
  })

  test('rejects invalid email and missing profile fields', async () => {
    const repository: UserProfileRepository = {
      findByUserId: jest.fn(),
      createIfNotExists: jest.fn(),
    }

    await expect(
      createUserProfile({ email: 'invalid-email', displayName: 'Coffee User' }, 'sub-123', repository),
    ).rejects.toThrow('Email is invalid')

    await expect(
      createUserProfile({ email: 'coffee@example.test', displayName: '   ' }, 'sub-123', repository),
    ).rejects.toThrow('Display name is required')
  })
})

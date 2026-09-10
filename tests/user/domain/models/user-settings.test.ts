import type { UserSettings } from '../../../../../src/user/domain/models'

describe('UserSettings', () => {
  test('represents a profile record in the user partition', () => {
    const profile: UserSettings = {
      pk: 'USER#cognito-sub',
      sk: 'SETTINGS#PROFILE',
      userId: 'cognito-sub',
      email: 'coffee@example.test',
      displayName: 'Coffee User',
      avatarUrl: 'https://example.test/avatar.png',
      createdAt: '2026-09-09T03:00:00.000Z',
      updatedAt: '2026-09-09T03:00:00.000Z',
    }

    expect(profile).toEqual({
      pk: 'USER#cognito-sub',
      sk: 'SETTINGS#PROFILE',
      userId: 'cognito-sub',
      email: 'coffee@example.test',
      displayName: 'Coffee User',
      avatarUrl: 'https://example.test/avatar.png',
      createdAt: '2026-09-09T03:00:00.000Z',
      updatedAt: '2026-09-09T03:00:00.000Z',
    })
  })
})

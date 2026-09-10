import type { UserSettings } from '../../domain/models'

export interface UserProfileCreationResult {
  created: boolean
  profile: UserSettings
}

export interface UserProfileRepository {
  findByUserId(userId: string): Promise<UserSettings | undefined>
  createIfNotExists(profile: UserSettings): Promise<UserProfileCreationResult>
}

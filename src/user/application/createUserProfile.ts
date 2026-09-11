import type { CreateUserProfileRequest, UserProfileRepository } from './interfaces'
import type { UserSettings } from '../domain/models'

export interface CreateUserProfileResult {
  created: boolean
  profile: UserSettings
}

const normalizeEmail = (value: string): string => value.trim().toLowerCase()
const normalizeDisplayName = (value: string): string => value.trim()
const normalizeAvatarUrl = (value?: string): string | undefined => {
  const avatarUrl = value?.trim()
  return avatarUrl ? avatarUrl : undefined
}

export const createUserProfile = async (
  request: CreateUserProfileRequest,
  userId: string,
  repository: UserProfileRepository,
): Promise<CreateUserProfileResult> => {
  const email = normalizeEmail(request.email ?? '')
  if (!email) {
    throw new Error('Email is required')
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    throw new Error('Email is invalid')
  }

  const displayName = normalizeDisplayName(request.displayName ?? '')
  if (!displayName) {
    throw new Error('Display name is required')
  }

  const avatarUrl = normalizeAvatarUrl(request.avatarUrl)
  const now = new Date().toISOString()

  const profile: UserSettings = {
    pk: `USER#${userId}`,
    sk: 'SETTINGS#PROFILE',
    userId,
    email,
    displayName,
    ...(avatarUrl ? { avatarUrl } : {}),
    createdAt: now,
    updatedAt: now,
  }

  return repository.createIfNotExists(profile)
}

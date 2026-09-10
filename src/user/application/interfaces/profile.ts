export interface CreateUserProfileRequest {
  email: string
  displayName: string
  avatarUrl?: string
}

export interface UserProfileResponse {
  user: {
    id: string
    email: string
    displayName: string
    avatarUrl?: string
    createdAt: string
    updatedAt: string
  }
}

export interface UserProfileErrorResponse {
  message: string
}

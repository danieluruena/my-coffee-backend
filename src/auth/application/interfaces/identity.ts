import type { AuthenticatedIdentity } from '../../domain/models'

export interface IdentityClaims {
  sub: string
  email?: string
  name?: string
}

export interface IdentityProvider {
  resolveIdentity(claims: IdentityClaims): AuthenticatedIdentity
}

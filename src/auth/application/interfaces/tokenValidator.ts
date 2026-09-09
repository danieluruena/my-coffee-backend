import type { IdentityClaims } from './identity'

export interface TokenValidator {
  validate(token: string): Promise<IdentityClaims>
}

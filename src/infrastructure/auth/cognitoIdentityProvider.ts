import type {
  IdentityProvider,
  IdentityClaims,
} from '../interfaces'
import type { AuthenticatedIdentity } from '../../domain/models'

export class CognitoIdentityProvider implements IdentityProvider {
  public resolveIdentity(claims: IdentityClaims): AuthenticatedIdentity {
    return {
      subject: claims.sub,
      ...(claims.email ? { email: claims.email } : {}),
      ...(claims.name ? { name: claims.name } : {}),
    }
  }
}

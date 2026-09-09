import { CognitoJwtVerifier } from 'aws-jwt-verify'
import type { IdentityClaims, TokenValidator } from '../application/interfaces'
import { EnvironmentConfig } from '../../shared/config/environment'

export class CognitoTokenValidator implements TokenValidator {
  private readonly verifier: ReturnType<typeof CognitoJwtVerifier.create>

  public constructor(config: EnvironmentConfig) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: config.cognitoUserPoolId,
      tokenUse: 'access',
      clientId: config.cognitoClientId,
    })
  }

  public async validate(token: string): Promise<IdentityClaims> {
    const claims = await this.verifier.verify(token)

    return {
      sub: claims.sub,
    }
  }
}

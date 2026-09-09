import type { IdentityProvider } from '../../application/interfaces/identity'
import { CognitoIdentityProvider } from '../../infrastructure/cognitoIdentityProvider'
import { CognitoTokenValidator } from '../../infrastructure/cognitoTokenValidator'
import type { TokenValidator } from '../../application/interfaces/tokenValidator'
import { loadEnvironment } from '../../../shared/config/environment'
import { getHeaderValue } from '../../../shared/utils'
import { AuthenticatedIdentity } from '../../domain/models'

export interface AuthorizerEvent {
  headers?: Record<string, string | undefined>
}

export interface AuthorizerResponse {
  isAuthorized: boolean
  context?: Record<string, string>
}

const getBearerToken = (event: AuthorizerEvent): string | undefined => {
  const authorization = getHeaderValue(event.headers, 'authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return undefined
  }

  const token = authorization.slice('Bearer '.length).trim()
  return token || undefined
}

const identityContext = (
  identity: AuthenticatedIdentity,
): Record<string, string> => {
  return {
    subject: identity.subject,
    ...(identity.email ? { email: identity.email } : {}),
    ...(identity.name ? { name: identity.name } : {}),
  }
}

export const authorize = async (
  event: AuthorizerEvent,
  identityProvider: IdentityProvider,
  tokenValidator: TokenValidator,
): Promise<AuthorizerResponse> => {
  try {
    const token = getBearerToken(event)

    if (!token) {
      return { isAuthorized: false }
    }

    const claims = await tokenValidator?.validate(token)

    if (!claims) {
      return { isAuthorized: false }
    }

    const identity = identityProvider.resolveIdentity(claims)

    return {
      isAuthorized: true,
      context: identityContext(identity),
    }
  } catch {
    return { isAuthorized: false }
  }
}

export const handler = async (event: AuthorizerEvent): Promise<AuthorizerResponse> => {
  const config = loadEnvironment()

  if (config.isLocalEnv) {
    const token = getBearerToken(event)
    return {
      isAuthorized: !!token,
      context: {
        subject: 'test',
        email: 'test@example.com',
        name: 'Test User',
      },
    }
  }

  const identityProvider = new CognitoIdentityProvider()
  const tokenValidator = new CognitoTokenValidator(config)
  return authorize(event, identityProvider, tokenValidator)
}

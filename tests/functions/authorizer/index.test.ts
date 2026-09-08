import { authorize } from '../../../src/functions/authorizer'
import { CognitoIdentityProvider } from '../../../src/infrastructure/auth/cognitoIdentityProvider'
import type { TokenValidator } from '../../../src/infrastructure/interfaces/auth/tokenValidator'

describe('authorizer', () => {
  const identityProvider = new CognitoIdentityProvider()
  const tokenValidator: TokenValidator = {
    validate: jest.fn().mockResolvedValue({
      sub: 'cognito-user',
      email: 'coffee@example.test',
    }),
  }

  test('rejects requests without a bearer token', async () => {
    await expect(
      authorize({ headers: {} }, identityProvider, tokenValidator),
    ).resolves.toEqual({ isAuthorized: false })
  })

  test('validates the bearer token and returns identity context', async () => {
    const response = await authorize(
      { headers: { Authorization: 'Bearer signed-token' } },
      identityProvider,
      tokenValidator,
    )

    expect(response).toEqual({
      isAuthorized: true,
      context: {
        subject: 'cognito-user',
        email: 'coffee@example.test',
      },
    })
    expect(tokenValidator.validate).toHaveBeenCalledWith('signed-token')
  })

  test('rejects a token when Cognito validation fails', async () => {
    const validator: TokenValidator = {
      validate: jest.fn().mockRejectedValue(new Error('invalid token')),
    }

    await expect(
      authorize(
        { headers: { authorization: 'Bearer invalid-token' } },
        identityProvider,
        validator,
      ),
    ).resolves.toEqual({ isAuthorized: false })
  })
})

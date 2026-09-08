import { CognitoIdentityProvider } from '../../../src/infrastructure/auth/cognitoIdentityProvider'

describe('CognitoIdentityProvider', () => {
  test('maps validated claims to the shared identity shape', () => {
    const provider = new CognitoIdentityProvider()

    expect(
      provider.resolveIdentity({
        sub: 'cognito-sub',
        email: 'coffee@example.test',
        name: 'Coffee User',
      }),
    ).toEqual({
      subject: 'cognito-sub',
      email: 'coffee@example.test',
      name: 'Coffee User',
    })
  })

  test('receives the same validated claims shape as the mock provider', () => {
    const provider = new CognitoIdentityProvider()

    expect(provider.resolveIdentity({ sub: 'cognito-sub' })).toEqual({
      subject: 'cognito-sub',
    })
  })
})

import { loadEnvironment } from '../../../src/shared/config/environment'

describe('loadEnvironment', () => {
  const originalEnvironment = process.env

  beforeEach(() => {
    process.env = {
      ENVIRONMENT: 'local',
      AWS_REGION: 'eu-west-1',
      TABLE_NAME: 'mi-cafecito-local',
      BUCKET_NAME: 'mi-cafecito-local',
      COGNITO_USER_POOL_ID: 'user-pool-id',
      COGNITO_CLIENT_ID: 'client-id',
    }
  })

  afterAll(() => {
    process.env = originalEnvironment
  })

  test('loads local configuration and optional service endpoints', () => {
    expect(loadEnvironment()).toEqual({
      environment: 'local',
      awsRegion: 'eu-west-1',
      tableName: 'mi-cafecito-local',
      bucketName: 'mi-cafecito-local',
      cognitoUserPoolId: 'user-pool-id',
      cognitoClientId: 'client-id',
      isLocalEnv: true,
    })
  })

  test('defaults to cognito and rejects missing required settings', () => {
    process.env = {}

    expect(() => loadEnvironment()).toThrow('Missing required environment variable: ENVIRONMENT')
  })

})

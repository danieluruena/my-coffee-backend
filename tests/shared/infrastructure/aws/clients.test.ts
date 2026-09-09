import { createDynamoDbClient, createS3Client } from '../../../../src/shared/infrastructure/aws/clients'

describe('AWS clients', () => {
  const config = {
    environment: 'local' as const,
    awsRegion: 'eu-west-1',
    tableName: 'table',
    bucketName: 'bucket',
    cognitoUserPoolId: 'user-pool-id',
    cognitoClientId: 'client-id',
    isLocalEnv: true,
  }

  test('configures DynamoDB with the local endpoint', async () => {
    const endpoint = await createDynamoDbClient(config).config.endpoint?.()

    expect(endpoint).toMatchObject({ hostname: 'localhost', port: 8000 })
  })

  test('configures S3 with a path-style local endpoint', async () => {
    const client = createS3Client(config)

    const endpoint = await client.config.endpoint?.()

    expect(endpoint).toMatchObject({ hostname: 'localhost', port: 4566 })
    expect(client.config.forcePathStyle).toBe(true)
  })
})

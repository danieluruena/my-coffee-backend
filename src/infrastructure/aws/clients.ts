import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import type { EnvironmentConfig } from '../../shared/config/environment'

export const createDynamoDbClient = (config: EnvironmentConfig): DynamoDBClient => {
  return new DynamoDBClient({
    region: config.awsRegion,
    ...(config.isLocalEnv ? { endpoint: 'http://localhost:8000' } : {}),
  })
}

export const createS3Client = (config: EnvironmentConfig): S3Client => {
  return new S3Client({
    region: config.awsRegion,
    ...(config.isLocalEnv
      ? {
        endpoint: 'http://localhost:4566',
        forcePathStyle: true,
      }
      : {}),
  })
}

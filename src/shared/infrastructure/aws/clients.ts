import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import type { EnvironmentConfig } from '../../config/environment'

export const createDynamoDbClient = (config: EnvironmentConfig): DynamoDBClient => {
  return new DynamoDBClient({
    region: config.awsRegion,
    ...(config.isLocalEnv
      ? {
        endpoint: process.env.DYNAMODB_ENDPOINT || 'http://host.docker.internal:8000',
        credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
      }
      : {}),
  })
}

export const createS3Client = (config: EnvironmentConfig): S3Client => {
  return new S3Client({
    region: config.awsRegion,
    ...(config.isLocalEnv
      ? {
        endpoint: process.env.S3_ENDPOINT || 'http://host.docker.internal:4566',
        forcePathStyle: true,
        credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
      }
      : {}),
  })
}

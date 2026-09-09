import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import {
  CreateBucketCommand,
  HeadBucketCommand,
  S3Client,
} from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION || 'us-east-1'
const tableName = process.env.TABLE_NAME || 'mi-cafecito-local'
const bucketName = process.env.BUCKET_NAME || 'mi-cafecito-local'
const dynamoDbEndpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
const s3Endpoint = process.env.S3_ENDPOINT || 'http://localhost:4566'
const credentials = { accessKeyId: 'local', secretAccessKey: 'local' }

const dynamoDb = new DynamoDBClient({
  region,
  endpoint: dynamoDbEndpoint,
  credentials,
})
const s3 = new S3Client({
  region,
  endpoint: s3Endpoint,
  forcePathStyle: true,
  credentials,
})

const ensureTable = async (): Promise<void> => {
  try {
    await dynamoDb.send(new DescribeTableCommand({ TableName: tableName }))
    return
  } catch (error: unknown) {
    if (!(error instanceof Error) || error.name !== 'ResourceNotFoundException') {
      throw error
    }
  }

  await dynamoDb.send(new CreateTableCommand({
    TableName: tableName,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
  }))
}

const ensureBucket = async (): Promise<void> => {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }))
  } catch (error: unknown) {
    const errorName = error instanceof Error ? error.name : undefined

    if (errorName !== 'NotFound' && errorName !== 'NoSuchBucket') {
      throw error
    }

    await s3.send(new CreateBucketCommand({ Bucket: bucketName }))
  }
}

const main = async (): Promise<void> => {
  await Promise.all([ensureTable(), ensureBucket()])
  console.log(`Local resources ready: ${tableName}, ${bucketName}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})

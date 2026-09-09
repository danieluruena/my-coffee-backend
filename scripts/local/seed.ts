import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const region = process.env.AWS_REGION || 'us-east-1'
const tableName = process.env.TABLE_NAME || 'mi-cafecito-local'
const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
const client = DynamoDBDocumentClient.from(new DynamoDBClient({
  region,
  endpoint,
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
}))

const items = [
  {
    PK: 'USER#mock-user-1',
    SK: 'COFFEE#seed-1',
    name: 'Local Espresso',
    rating: 5,
  },
  {
    PK: 'USER#mock-user-2',
    SK: 'COFFEE#seed-2',
    name: 'Local Filter',
    rating: 4,
  },
]

const main = async (): Promise<void> => {
  await Promise.all(
    items.map((Item) =>
      client.send(new PutCommand({ TableName: tableName, Item })),
    ),
  )
  console.log(`Seeded ${items.length} local records`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})

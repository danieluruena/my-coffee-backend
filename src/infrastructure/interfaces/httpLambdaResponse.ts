export interface HttpLambdaResponse {
  statusCode: number
  headers: Record<string, string>
  body: string
}

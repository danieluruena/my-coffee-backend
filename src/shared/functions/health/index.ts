import { HttpLambdaResponse } from '../../interfaces'


export const handler = async (): Promise<HttpLambdaResponse> => {
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ status: 'ok' }),
  }
}

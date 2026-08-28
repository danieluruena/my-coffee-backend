export interface HealthResponse {
  statusCode: number
  headers: Record<string, string>
  body: string
}

export async function handler(): Promise<HealthResponse> {
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ status: 'ok' }),
  }
}

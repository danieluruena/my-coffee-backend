import { handler } from '../../../src/functions/health'

describe('health handler', () => {
  test('returns a healthy HTTP response', async () => {
    const response = await handler()

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe('application/json')
    expect(JSON.parse(response.body)).toEqual({ status: 'ok' })
  })
})

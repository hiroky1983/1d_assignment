import { http, HttpResponse } from 'msw'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { GET } from '@/app/api/search/route'
import { server } from '@/mocks/server'

describe('Search API Route', () => {
  const createRequest = (url: string, headers: Record<string, string> = {}) => {
    return new NextRequest(new URL(url, 'http://localhost'), {
      headers: new Headers(headers),
    })
  }

  it('should return 200 and search results for a valid query', async () => {
    const req = createRequest('http://localhost/api/search?q=test')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.items).toBeDefined()
    expect(data.items.length).toBeGreaterThanOrEqual(0)
  })

  it('should return 400 for invalid parameters (e.g. query too long)', async () => {
    const longQuery = 'a'.repeat(101)
    const req = createRequest(`http://localhost/api/search?q=${longQuery}`)
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.message).toBe('Invalid parameters')
  })

  it('should return empty list when no query is provided', async () => {
    const req = createRequest('http://localhost/api/search')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.total_count).toBe(0)
    expect(data.items).toEqual([])
  })

  it('should handle GitHub API error and return proper status code', async () => {
    // Override MSW handler for this specific test
    server.use(
      http.get('https://api.github.com/search/repositories', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'GitHub API is down' }),
          { status: 503 },
        )
      }),
    )

    const req = createRequest('http://localhost/api/search?q=test')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(503)
    expect(data.message).toBe('GitHub API is down')
  })

  it('should return 429 when rate limited (using mock IP)', async () => {
    const ip = '1.2.3.4'
    const headers = { 'x-forwarded-for': ip }

    // We send requests until we hit the limit (set to 10 in route.ts)
    for (let i = 0; i < 10; i++) {
      await GET(createRequest('http://localhost/api/search?q=test', headers))
    }

    const res = await GET(
      createRequest('http://localhost/api/search?q=test', headers),
    )
    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ message: 'Too Many Requests' })
  })
})

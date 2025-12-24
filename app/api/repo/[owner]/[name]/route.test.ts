import { http, HttpResponse } from 'msw'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { GET } from '@/app/api/repo/[owner]/[name]/route'
import { server } from '@/mocks/server'

describe('Repo Detail API Route', () => {
  const createRequest = (url: string) => {
    return new NextRequest(new URL(url, 'http://localhost'))
  }

  it('should return 200 and repo detail for valid params', async () => {
    const req = createRequest('http://localhost/api/repo/facebook/react')
    const res = await GET(req, {
      params: Promise.resolve({ owner: 'facebook', name: 'react' }),
    })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.full_name).toBe('facebook/react')
  })

  it('should return 404 when repository is not found', async () => {
    server.use(
      http.get('https://api.github.com/repos/facebook/not-found', () => {
        return new HttpResponse(JSON.stringify({ message: 'Not Found' }), {
          status: 404,
        })
      }),
    )

    const req = createRequest('http://localhost/api/repo/facebook/not-found')
    const res = await GET(req, {
      params: Promise.resolve({ owner: 'facebook', name: 'not-found' }),
    })
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.message).toBe('Repository not found')
  })

  it('should return 500 when GitHub API returns an error', async () => {
    server.use(
      http.get('https://api.github.com/repos/facebook/react', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'GitHub API is down' }),
          { status: 503 },
        )
      }),
    )

    const req = createRequest('http://localhost/api/repo/facebook/react')
    const res = await GET(req, {
      params: Promise.resolve({ owner: 'facebook', name: 'react' }),
    })
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.message).toBe('GitHub API is down')
  })
})

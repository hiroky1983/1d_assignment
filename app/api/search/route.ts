import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { SearchResponse, searchParamsSchema } from '@/features/search/types'
import { rateLimit } from '@/lib/ratelimit'

const limiter = rateLimit({
  interval: 10 * 1000, // 10 seconds
  uniqueTokenPerInterval: 500,
})

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Rate Limit Check
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'
    const { isRateLimited, limit, currentUsage } = limiter.check(10, ip) // Limit 10 requests per minute

    if (isRateLimited) {
      return NextResponse.json(
        { message: 'Too Many Requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': Math.max(
              0,
              limit - currentUsage,
            ).toString(),
          },
        },
      )
    }

    const { searchParams } = new URL(request.url)

    // Zod Validation
    const parseResult = searchParamsSchema.safeParse({
      q: searchParams.get('q') || undefined,
      page: searchParams.get('page'),
    })

    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid parameters',
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { q, page } = parseResult.data

    if (!q) {
      return NextResponse.json(
        { total_count: 0, items: [], incomplete_results: false },
        { status: 200 },
      )
    }

    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&page=${page}`,
      {
        headers: {
          ...(env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` }
            : {}),
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    )

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json(
        { message: errorData.message || 'GitHub API Error' },
        { status: res.status },
      )
    }

    const data: SearchResponse = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

import { NextResponse } from 'next/server'

import { getRepoDetail } from '@/features/repo-detail/api/repo'

export async function GET(
  request: Request,
  props: { params: Promise<{ owner: string; name: string }> },
) {
  const params = await props.params
  const { owner, name } = params

  try {
    const data = await getRepoDetail(owner, name)
    return NextResponse.json(data)
  } catch (error) {
    if (
      error instanceof Error &&
      (error as { digest?: string }).digest?.startsWith(
        'NEXT_PRERENDER_INTERRUPTED',
      )
    ) {
      throw error
    }

    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return NextResponse.json(
        { message: 'Repository not found' },
        { status: 404 },
      )
    }

    console.error('Repo Detail API Error:', error)
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    )
  }
}

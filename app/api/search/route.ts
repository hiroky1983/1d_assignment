import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { SearchResponse } from '@/features/search/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';

    if (!q) {
      return NextResponse.json({ total_count: 0, items: [], incomplete_results: false }, { status: 200 });
    }

    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { message: errorData.message || 'GitHub API Error' },
        { status: res.status }
      );
    }

    const data: SearchResponse = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

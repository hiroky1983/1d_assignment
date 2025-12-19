import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { RepoDetail } from '@/features/repo-detail/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, props: { params: Promise<{ owner: string; name: string }> }) {
  const params = await props.params;
  const { owner, name } = params;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: {
        ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ message: 'Repository not found' }, { status: 404 });
      }
      const errorData = await res.json();
      return NextResponse.json(
        { message: errorData.message || 'GitHub API Error' },
        { status: res.status }
      );
    }

    const data: RepoDetail = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Repo Detail API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

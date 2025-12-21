import { notFound } from 'next/navigation'
import { env } from '@/lib/env'
import { RepoDetailScreen } from '@/screens/RepoDetailScreen'
import { RepoDetail } from '@/features/repo-detail/types'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ owner: string; name: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getRepo(owner: string, name: string): Promise<RepoDetail> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: {
      ...(env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` }
        : {}),
      Accept: 'application/vnd.github.v3+json',
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error('Failed to fetch repository')
  }

  return res.json()
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { owner, name } = params

  // Optimistically set title, or fetch if needed.
  // For better SEO we might fetch, but standard practice:
  return {
    title: `${owner}/${name} - GitHub Search`,
    description: `Details for ${owner}/${name} repository`,
  }
}

/**
 * リポジトリ詳細ページ (Server Component)
 * URL パラメータに基づいてリポジトリ詳細情報を取得・表示します。
 */
export default async function Page(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { owner, name } = params
  const repo = await getRepo(owner, name)

  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const page =
    typeof searchParams.page === 'string'
      ? parseInt(searchParams.page)
      : undefined

  return <RepoDetailScreen repo={repo} searchParams={{ q, page }} />
}

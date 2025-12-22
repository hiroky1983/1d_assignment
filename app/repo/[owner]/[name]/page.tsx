import { Metadata } from 'next'
import { Suspense } from 'react'

import {
  RepoDetailSkeleton,
  RepoDetailView,
} from '@/features/repo-detail/components/RepoDetailView'
import { RepoDetailScreen } from '@/screens/RepoDetailScreen'

type Props = {
  params: Promise<{ owner: string; name: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { owner, name } = params

  return {
    title: `${owner}/${name} - GitHub Search`,
    description: `Details for ${owner}/${name} repository`,
  }
}

/**
 * リポジトリ詳細ページ (Server Component)
 * URL パラメータに基づいてリポジトリ詳細情報を表示します。
 */
export default async function Page(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { owner, name } = params

  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const page =
    typeof searchParams.page === 'string'
      ? parseInt(searchParams.page)
      : undefined

  return (
    <RepoDetailScreen searchParams={{ q, page }}>
      <Suspense fallback={<RepoDetailSkeleton />}>
        <RepoDetailView owner={owner} name={name} />
      </Suspense>
    </RepoDetailScreen>
  )
}

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
 * PPR (Partial Prerendering) を有効化
 */
export const experimental_ppr = true

/**
 * リポジトリ詳細ページ (Server Component)
 * URL パラメータに基づいてリポジトリ詳細情報を表示します。
 */
export default function Page(props: Props) {
  return (
    <RepoDetailScreen searchParamsPromise={props.searchParams}>
      <Suspense fallback={<RepoDetailSkeleton />}>
        <RepoDetailView paramsPromise={props.params} />
      </Suspense>
    </RepoDetailScreen>
  )
}

'use client'

import { EmptyState } from '@/components/states/EmptyState'
import { ErrorState } from '@/components/states/ErrorState'
import { LoadingState } from '@/components/states/LoadingState'
import { Pagination } from '@/features/search/components/Pagination'
import { RepoList } from '@/features/search/components/RepoList'
import { SearchInput } from '@/features/search/components/SearchInput'
import { useSearch } from '@/features/search/hooks/useSearch'

import type { SearchResponse } from '../types'

/**
 * 検索結果の内容を表示する内部コンポーネント
 * 状態（エラー、読み込み中、空、データあり）に応じて適切なUIを返却します。
 */
const SearchResultContent = ({
  error,
  isLoading,
  data,
  query,
  page,
  setPage,
}: {
  error: (Error & { digest?: string }) | null
  isLoading: boolean
  data: SearchResponse | undefined
  query: string
  page: number
  setPage: (page: number) => void
}) => {
  // 1. エラー状態
  if (error) {
    return <ErrorState error={error} reset={() => window.location.reload()} />
  }

  // 2. 初回読み込み中 (データがない場合のみLoadingを表示)
  if (isLoading && !data) {
    return <LoadingState />
  }

  // 3. データが存在しない（検索前など）
  if (!data?.items) {
    return null
  }

  // 4. 検索結果が空
  if (data.items.length === 0) {
    return <EmptyState />
  }

  // 5. 検索結果の表示
  return (
    <>
      <div className="text-app-text-muted mx-auto mb-4 w-full max-w-7xl text-right text-sm">
        Found {data.total_count.toLocaleString()} results
      </div>
      <RepoList repos={data.items} currentQuery={query} currentPage={page} />
      <Pagination
        currentPage={page}
        totalCount={data.total_count}
        onPageChange={setPage}
      />
    </>
  )
}

/**
 * 検索画面のコンテンツコンポーネント (Client Component)
 * 検索ロジックと結果表示を担当します。
 */
export const SearchContainer = () => {
  const { query, triggerSearch, data, error, isLoading, page, setPage } =
    useSearch()

  return (
    <div className="flex w-full flex-col items-center">
      <SearchInput
        value={query}
        onSearch={triggerSearch}
        isLoading={isLoading}
      />

      <div className="mt-8 w-full">
        <SearchResultContent
          error={error}
          isLoading={isLoading}
          data={data}
          query={query}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  )
}

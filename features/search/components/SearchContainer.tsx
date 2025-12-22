'use client'

import { EmptyState } from '@/components/states/EmptyState'
import { ErrorState } from '@/components/states/ErrorState'
import { LoadingState } from '@/components/states/LoadingState'
import { Pagination } from '@/features/search/components/Pagination'
import { RepoList } from '@/features/search/components/RepoList'
import { SearchInput } from '@/features/search/components/SearchInput'
import { useSearch } from '@/features/search/hooks/useSearch'

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
        key={query}
        initialValue={query}
        onSearch={triggerSearch}
        isLoading={isLoading}
      />

      <div className="mt-8 w-full">
        {error ? (
          <ErrorState error={error} reset={() => window.location.reload()} />
        ) : isLoading && !data ? (
          <LoadingState />
        ) : data?.items ? (
          data.items.length > 0 ? (
            <>
              <div className="text-app-text-muted mx-auto mb-4 w-full max-w-7xl text-right text-sm">
                Found {data.total_count.toLocaleString()} results
              </div>
              <RepoList
                repos={data.items}
                currentQuery={query}
                currentPage={page}
              />
              <Pagination
                currentPage={page}
                totalCount={data.total_count}
                onPageChange={setPage}
              />
            </>
          ) : (
            <EmptyState />
          )
        ) : null}
      </div>
    </div>
  )
}

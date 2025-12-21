'use client'

import { Suspense } from 'react'

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
const SearchScreenContent = () => {
  const { query, triggerSearch, data, error, isLoading, page, setPage } =
    useSearch()

  return (
    <div className="bg-app-bg text-app-text-main min-h-screen pb-20 font-sans">
      {/* Header moved to layout */}
      <main className="container mx-auto flex flex-col items-center px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="from-app-text-main to-app-text-muted mb-4 bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Find Repositories
          </h1>
          <p className="text-app-text-muted">
            Search for GitHub repositories by name, description, or topic.
          </p>
        </div>

        <SearchInput
          value={query}
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
      </main>
    </div>
  )
}

/**
 * 検索画面のメインコンポーネント
 * UseSearch hook や Suspense boundary を管理します。
 */
export const SearchScreen = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-app-bg min-h-screen">
          {/* Header is now in layout */}
          <LoadingState />
        </div>
      }
    >
      <SearchScreenContent />
    </Suspense>
  )
}

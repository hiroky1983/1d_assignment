'use client'

import React, { Suspense } from 'react'
import { SearchInput } from '@/features/search/components/SearchInput'
import { RepoList } from '@/features/search/components/RepoList'
import { Pagination } from '@/features/search/components/Pagination'
import { useSearch } from '@/features/search/hooks/useSearch'
import { LoadingState } from '@/components/states/LoadingState'
import { ErrorState } from '@/components/states/ErrorState'
import { EmptyState } from '@/components/states/EmptyState'

/**
 * 検索画面のコンテンツコンポーネント (Client Component)
 * 検索ロジックと結果表示を担当します。
 */
const SearchScreenContent = () => {
  const {
    query,
    setQuery,
    triggerSearch,
    data,
    error,
    isLoading,
    page,
    setPage,
  } = useSearch()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      {/* Header moved to layout */}
      <main className="container mx-auto flex flex-col items-center px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Find Repositories
          </h1>
          <p className="text-gray-500">
            Search for GitHub repositories by name, description, or topic.
          </p>
        </div>

        <SearchInput
          value={query}
          onChange={setQuery}
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
                <div className="mx-auto mb-4 w-full max-w-7xl text-right text-sm text-gray-500">
                  Found {data.total_count.toLocaleString()} results
                </div>
                <RepoList repos={data.items} />
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
        <div className="min-h-screen bg-gray-50">
          {/* Header is now in layout */}
          <LoadingState />
        </div>
      }
    >
      <SearchScreenContent />
    </Suspense>
  )
}

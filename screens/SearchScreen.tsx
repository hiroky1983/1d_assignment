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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Header moved to layout */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 mb-4 tracking-tight">
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

        <div className="w-full mt-8">
          {error ? (
            <ErrorState error={error} reset={() => window.location.reload()} />
          ) : isLoading && !data ? (
            <LoadingState />
          ) : data?.items ? (
            data.items.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-500 text-right w-full max-w-7xl mx-auto">
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

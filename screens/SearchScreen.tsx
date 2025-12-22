import { Suspense } from 'react'

import { LoadingState } from '@/components/states/LoadingState'
import { SearchContainer } from '@/features/search/components/SearchContainer'

/**
 * 検索画面のメインコンポーネント (Server Component)
 * 画面全体のレイアウト、ロードされない静的ヘッダー、および Suspense 境界を提供します。
 */
export const SearchScreen = () => {
  return (
    <div className="bg-app-bg text-app-text-main min-h-screen pb-20 font-sans">
      <main className="container mx-auto flex flex-col items-center px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="from-app-text-main to-app-text-muted mb-4 bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Find Repositories
          </h1>
          <p className="text-app-text-muted">
            Search for GitHub repositories by name, description, or topic.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="w-full">
              <LoadingState />
            </div>
          }
        >
          <SearchContainer />
        </Suspense>
      </main>
    </div>
  )
}

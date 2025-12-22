import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

interface RepoDetailScreenProps {
  children: React.ReactNode
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * リポジトリ詳細画面 (Server Screen)
 * リポジトリ詳細情報の全体レイアウトを担当します。
 */
export const RepoDetailScreen = ({
  children,
  searchParamsPromise,
}: RepoDetailScreenProps) => {
  return (
    <div className="bg-app-bg pb-20 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="text-app-text-muted mb-6 inline-flex items-center opacity-50">
              <div className="border-app-border bg-app-card mr-2 rounded-full border p-2 shadow-sm">
                <ArrowLeft className="h-5 w-5" />
              </div>
              Back to Search
            </div>
          }
        >
          <BackLink searchParamsPromise={searchParamsPromise} />
        </Suspense>
        {children}
      </main>
    </div>
  )
}

/**
 * 検索へ戻るリンク (Internal)
 * searchParams を待機するため個別に Suspense されます。
 */
const BackLink = async ({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParams = await searchParamsPromise
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const page =
    typeof searchParams.page === 'string'
      ? parseInt(searchParams.page)
      : undefined

  const backQuery = new URLSearchParams()
  if (q) backQuery.set('q', q)
  if (page && page > 1) backQuery.set('page', page.toString())
  const backHref = backQuery.toString() ? `/?${backQuery.toString()}` : '/'

  return (
    <Link
      href={backHref}
      className="group text-app-text-muted hover:text-app-text-main mb-6 inline-flex items-center transition-colors"
    >
      <div className="border-app-border bg-app-card group-hover:border-app-text-muted mr-2 rounded-full border p-2 shadow-sm">
        <ArrowLeft className="h-5 w-5" />
      </div>
      Back to Search
    </Link>
  )
}

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { RepoDetailView } from '@/features/repo-detail/components/RepoDetailView'
import { RepoDetail } from '@/features/repo-detail/types'

interface RepoDetailScreenProps {
  repo: RepoDetail
  searchParams?: {
    q?: string
    page?: number
  }
}

/**
 * リポジトリ詳細画面 (Server Screen)
 * リポジトリ詳細情報の全体レイアウトを担当します。
 */
export const RepoDetailScreen = ({
  repo,
  searchParams,
}: RepoDetailScreenProps) => {
  const backQuery = new URLSearchParams()
  if (searchParams?.q) backQuery.set('q', searchParams.q)
  if (searchParams?.page && searchParams.page > 1)
    backQuery.set('page', searchParams.page.toString())
  const backHref = backQuery.toString() ? `/?${backQuery.toString()}` : '/'

  return (
    <div className="bg-app-bg pb-20 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Link
          href={backHref}
          className="group text-app-text-muted hover:text-app-text-main mb-6 inline-flex items-center transition-colors"
        >
          <div className="border-app-border bg-app-card group-hover:border-app-text-muted mr-2 rounded-full border p-2 shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </div>
          Back to Search
        </Link>
        <RepoDetailView repo={repo} />
      </main>
    </div>
  )
}

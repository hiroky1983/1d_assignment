import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Header } from '@/components/layout/Header'
import { Skeleton } from '@/components/ui/Skeleton'

/**
 * リポジトリ詳細ローディング画面 (Server Component)
 * 詳細ページ読み込み中に表示されるスケルトン UI です。
 */
export default function Loading() {
  return (
    <div className="bg-app-bg min-h-screen pb-20 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="group text-app-text-muted hover:text-app-text-main mb-6 inline-flex items-center transition-colors"
        >
          <div className="border-app-border bg-app-card group-hover:border-app-text-muted mr-2 rounded-full border p-2 shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </div>
          Back to Search
        </Link>

        <div className="border-app-border bg-app-card overflow-hidden rounded-xl border shadow-sm">
          <div className="border-app-border bg-app-bg/50 border-b p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="mb-3 h-8 w-64" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <Skeleton className="mb-4 h-6 w-full" />
            <Skeleton className="mb-8 h-6 w-3/4" />

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

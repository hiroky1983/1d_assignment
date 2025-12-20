import { Header } from '@/components/layout/Header'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft } from 'lucide-react'

/**
 * リポジトリ詳細ローディング画面 (Server Component)
 * 詳細ページ読み込み中に表示されるスケルトン UI です。
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 inline-flex items-center text-gray-500">
          <div className="mr-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </div>
          Back to Search
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/50 p-8">
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

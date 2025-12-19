import { Header } from '@/components/layout/Header'
import { Skeleton } from '@/components/ui/Skeleton'
import { ArrowLeft } from 'lucide-react'

/**
 * リポジトリ詳細ローディング画面 (Server Component)
 * 詳細ページ読み込み中に表示されるスケルトン UI です。
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="inline-flex items-center text-gray-500 mb-6">
          <div className="p-2 bg-white rounded-full shadow-sm border border-gray-200 mr-2">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to Search
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-center gap-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-64 mb-3" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-8" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

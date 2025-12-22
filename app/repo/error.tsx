'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { ErrorState } from '@/components/states/ErrorState'

/**
 * リポジトリ詳細関連のエラーバウンダリ (Client Component)
 * 詳細ページでのエラー時に、検索画面に戻る導線を提供します。
 */
export default function RepoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    console.error('Repo Error:', error)
  }, [error])

  const q = searchParams.get('q')
  const page = searchParams.get('page')

  const backQuery = new URLSearchParams()
  if (q) backQuery.set('q', q)
  if (page) backQuery.set('page', page)
  const backHref = backQuery.toString() ? `/?${backQuery.toString()}` : '/'

  return (
    <div className="bg-app-bg min-h-screen font-sans">
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

        <div className="mt-12">
          <ErrorState error={error} reset={reset} />
        </div>
      </main>
    </div>
  )
}

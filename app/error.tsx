'use client'

import { useEffect } from 'react'

import { ErrorState } from '@/components/states/ErrorState'

/**
 * ルートエラーバウンダリ (Client Component)
 * アプリケーション全体でキャッチされなかったエラーを表示します。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-app-bg flex min-h-screen items-center justify-center">
      <ErrorState error={error} reset={reset} />
    </div>
  )
}

import React from 'react'

/**
 * エラー状態表示コンポーネント (UI)
 * エラー発生時のアラートと再試行アクションを提供します。
 */
export const ErrorState = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
      <p className="text-gray-600">{error.message}</p>
      {reset && (
        <button
          onClick={() => reset()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
        >
          Try again
        </button>
      )}
    </div>
  )
}

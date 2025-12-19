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
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
      <p className="text-gray-600">{error.message}</p>
      {reset && (
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Try again
        </button>
      )}
    </div>
  )
}

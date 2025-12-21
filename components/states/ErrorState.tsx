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
      <h2 className="text-app-error text-xl font-bold">
        Something went wrong!
      </h2>
      <p className="text-app-text-muted">{error.message}</p>
      {reset && (
        <button
          onClick={() => reset()}
          className="bg-app-primary text-app-primary-foreground rounded-lg px-4 py-2 transition-colors duration-200 hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  )
}

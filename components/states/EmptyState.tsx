import { SearchX } from 'lucide-react'

/**
 * 空状態表示コンポーネント (UI)
 * データが存在しない場合に表示するメッセージコンポーネントです。
 */
export const EmptyState = ({
  message = 'No repositories found.',
}: {
  message?: string
}) => {
  return (
    <div className="text-app-text-muted flex flex-col items-center justify-center py-16">
      <div className="bg-app-bg-hover mb-4 rounded-full p-4">
        <SearchX className="text-app-text-disabled h-8 w-8" />
      </div>
      <p className="text-app-text-main text-lg font-medium">{message}</p>
      <p className="mt-2 text-sm">Try adjusting your search query.</p>
    </div>
  )
}

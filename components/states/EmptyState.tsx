import { SearchX } from 'lucide-react'
import React from 'react'

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
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <SearchX className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-lg font-medium">{message}</p>
      <p className="mt-2 text-sm">Try adjusting your search query.</p>
    </div>
  )
}

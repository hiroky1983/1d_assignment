import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalCount: number
  perPage?: number
  onPageChange: (page: number) => void
}

/**
 * ページネーションコンポーネント (UI)
 * 検索結果のページ送りを管理・表示します。
 */
export const Pagination = ({
  currentPage,
  totalCount,
  perPage = 10,
  onPageChange,
}: PaginationProps) => {
  // Cap at 1000 results as per GitHub API limitation for generic search
  const maxResults = Math.min(totalCount, 1000)
  const totalPages = Math.ceil(maxResults / perPage)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'p-2 rounded-md border border-gray-200 transition-colors',
          currentPage <= 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100',
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'p-2 rounded-md border border-gray-200 transition-colors',
          currentPage >= totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100',
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

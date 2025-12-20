import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RepoDetailView } from '@/features/repo-detail/components/RepoDetailView'
import { RepoDetail } from '@/features/repo-detail/types'

interface RepoDetailScreenProps {
  repo: RepoDetail
}

/**
 * リポジトリ詳細画面 (Server Screen)
 * リポジトリ詳細情報の全体レイアウトを担当します。
 */
export const RepoDetailScreen = ({ repo }: RepoDetailScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="group mb-6 inline-flex items-center text-gray-500 transition-colors hover:text-gray-900"
        >
          <div className="mr-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm group-hover:border-gray-300">
            <ArrowLeft className="h-5 w-5" />
          </div>
          Back to Search
        </Link>
        <RepoDetailView repo={repo} />
      </main>
    </div>
  )
}

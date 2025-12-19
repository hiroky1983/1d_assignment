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
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
        >
          <div className="p-2 bg-white rounded-full shadow-sm border border-gray-200 mr-2 group-hover:border-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to Search
        </Link>
        <RepoDetailView repo={repo} />
      </main>
    </div>
  )
}

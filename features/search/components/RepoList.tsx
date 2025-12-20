import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { GitHubRepo } from '../types'
import { Skeleton } from '@/components/ui/Skeleton'

interface RepoListProps {
  repos: GitHubRepo[]
  currentQuery?: string
  currentPage?: number
}

/**
 * リポジトリ一覧表示コンポーネント (UI)
 * リポジトリのリストをグリッド形式で表示します。
 */
export const RepoList = ({
  repos,
  currentQuery = '',
  currentPage = 1,
}: RepoListProps) => {
  const searchParams = new URLSearchParams()
  if (currentQuery) searchParams.set('q', currentQuery)
  if (currentPage > 1) searchParams.set('page', currentPage.toString())
  const queryString = searchParams.toString()

  return (
    <div className="mt-8 grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <Link
          key={repo.id}
          href={`/repo/${repo.owner.login}/${repo.name}${queryString ? `?${queryString}` : ''}`}
          className="group block h-full"
        >
          <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 flex items-center">
              <Image
                src={repo.owner.avatar_url}
                alt={`${repo.owner.login} avatar`}
                width={80}
                height={80}
                className="mr-3 h-10 w-10 rounded-full border border-gray-100"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  {repo.name}
                </h3>
                <p className="truncate text-sm text-gray-500">
                  {repo.owner.login}
                </p>
              </div>
            </div>

            <p className="mb-4 line-clamp-3 grow text-sm text-gray-600">
              {repo.description || 'No description available'}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center" title="Stars">
                  <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
                  {repo.stargazers_count.toLocaleString()}
                </span>
                {repo.language && (
                  <span className="flex items-center">
                    <span className="mr-2 h-3 w-3 rounded-full bg-blue-500 opacity-75"></span>
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}

/**
 * リポジトリ一覧のスケルトンローディング (UI)
 */
export const RepoListSkeleton = () => {
  return (
    <div className="mt-8 grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex h-64 flex-col rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="mb-4 flex items-center">
            <Skeleton className="mr-3 h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-2/3" />
          <div className="mt-auto flex justify-between pt-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Repository } from '../types'
import { Skeleton } from '@/components/ui/Skeleton'

interface RepoListProps {
  repos: Repository[]
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
    <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-4">
      {repos.map((repo) => (
        <Link
          key={repo.id}
          href={`/repo/${repo.owner.login}/${repo.name}${queryString ? `?${queryString}` : ''}`}
          className="group block"
        >
          <article className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:items-start">
            <div className="shrink-0">
              <Image
                src={repo.owner.avatar_url}
                alt={`${repo.owner.login} avatar`}
                width={80}
                height={80}
                className="h-12 w-12 rounded-full border border-gray-100 sm:h-14 sm:w-14"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2">
                <h3 className="truncate text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  {repo.name}
                </h3>
                <p className="truncate text-sm text-gray-500">
                  {repo.owner.login}
                </p>
              </div>

              <p className="mb-4 line-clamp-2 text-sm text-gray-600 sm:line-clamp-3">
                {repo.description || 'No description available'}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center" title="Stars">
                  <Star className="mr-1.5 h-4 w-4 fill-current text-yellow-500" />
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
    <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row"
        >
          <div className="shrink-0">
            <Skeleton className="h-12 w-12 rounded-full sm:h-14 sm:w-14" />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-baseline gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-2/3" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

import { CircleDot, ExternalLink, Eye, GitFork, Star } from 'lucide-react'
import Image from 'next/image'

import { RepoDetail } from '../types'

interface RepoDetailViewProps {
  repo: RepoDetail
}

/**
 * リポジトリ詳細表示コンポーネント (Server Component compatible)
 * リポジトリの詳細情報、統計、トピック等を表示します。
 */
export const RepoDetailView = ({ repo }: RepoDetailViewProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-6">
            <Image
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-md"
              priority
            />
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
                {repo.name}
                <span className="text-xl font-normal text-gray-400">/</span>
                <span className="text-gray-600">{repo.owner.login}</span>
              </h1>
              {repo.language && (
                <div className="mt-2 flex items-center text-gray-600">
                  <span className="mr-2 h-3 w-3 rounded-full bg-blue-500"></span>
                  {repo.language}
                </div>
              )}
            </div>
          </div>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
          >
            View on GitHub
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="p-8">
        <p className="mb-8 max-w-4xl text-xl leading-relaxed text-gray-600">
          {repo.description || 'No description provided.'}
        </p>

        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          <StatCard
            icon={<Star className="h-6 w-6 text-yellow-500" />}
            label="Stars"
            value={repo.stargazers_count}
          />
          <StatCard
            icon={<Eye className="h-6 w-6 text-blue-500" />}
            label="Watchers"
            value={repo.subscribers_count}
          />
          <StatCard
            icon={<GitFork className="h-6 w-6 text-purple-500" />}
            label="Forks"
            value={repo.forks_count}
          />
          <StatCard
            icon={<CircleDot className="h-6 w-6 text-green-500" />}
            label="Issues"
            value={repo.open_issues_count}
          />
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {repo.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 統計情報カードコンポーネント (Internal component)
 * アイコン、数値、ラベルを表示します。
 */
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
      <div className="mb-2 rounded-full bg-white p-2 shadow-sm">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

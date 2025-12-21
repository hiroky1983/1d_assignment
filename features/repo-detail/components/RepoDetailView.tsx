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
    <div className="border-app-border bg-app-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-app-border from-app-bg to-app-card border-b bg-linear-to-r p-8">
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
              <h1 className="text-app-text-main flex items-center gap-2 text-3xl font-bold">
                {repo.name}
                <span className="text-app-text-muted text-xl font-normal">
                  /
                </span>
                <span className="text-app-text-muted">{repo.owner.login}</span>
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
            className="bg-app-text-main flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors hover:opacity-90"
          >
            View on GitHub
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="p-8">
        <p className="text-app-text-muted mb-8 max-w-4xl text-xl leading-relaxed">
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
                  className="bg-app-bg text-app-text-muted hover:bg-app-border rounded-full px-3 py-1 text-sm font-medium transition-colors"
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
    <div className="border-app-border bg-app-bg flex flex-col items-center justify-center rounded-lg border p-4 text-center">
      <div className="bg-app-card mb-2 rounded-full p-2 shadow-sm">{icon}</div>
      <div className="text-app-text-main text-2xl font-bold">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

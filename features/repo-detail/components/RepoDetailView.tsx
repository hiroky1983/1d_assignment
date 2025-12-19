import Image from 'next/image'
import { Star, GitFork, Eye, CircleDot, ExternalLink } from 'lucide-react'
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-8 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Image
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {repo.name}
                <span className="text-gray-400 font-normal text-xl">/</span>
                <span className="text-gray-600">{repo.owner.login}</span>
              </h1>
              {repo.language && (
                <div className="flex items-center mt-2 text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  {repo.language}
                </div>
              )}
            </div>
          </div>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View on GitHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>

      <div className="p-8">
        <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-4xl">
          {repo.description || 'No description provided.'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Star className="w-6 h-6 text-yellow-500" />}
            label="Stars"
            value={repo.stargazers_count}
          />
          <StatCard
            icon={<Eye className="w-6 h-6 text-blue-500" />}
            label="Watchers"
            value={repo.subscribers_count}
          />
          <StatCard
            icon={<GitFork className="w-6 h-6 text-purple-500" />}
            label="Forks"
            value={repo.forks_count}
          />
          <StatCard
            icon={<CircleDot className="w-6 h-6 text-green-500" />}
            label="Issues"
            value={repo.open_issues_count}
          />
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {repo.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
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
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-gray-100">
      <div className="mb-2 p-2 bg-white rounded-full shadow-sm">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

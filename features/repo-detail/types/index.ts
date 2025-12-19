import { GitHubRepo } from '@/features/search/types'

export type RepoDetail = GitHubRepo & {
  subscribers_count: number // For watchers (Github API logic)
  topics: string[]
}

export interface RepoDetailResponse {
  repo: RepoDetail
}

import { Repository } from '@/features/search/types'

export type RepoDetail = Repository & {
  subscribers_count: number // For watchers (Github API logic)
  topics: string[]
}

export interface RepoDetailResponse {
  repo: RepoDetail
}

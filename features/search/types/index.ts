export interface GitHubRepo {
  id: number
  node_id: string
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  html_url: string
}

export interface SearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepo[]
}

export interface SearchParams {
  q: string
  page?: number
  per_page?: number
}

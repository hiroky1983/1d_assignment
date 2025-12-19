import { RepoListSkeleton } from '@/features/search/components/RepoList'

/**
 * ロード中状態表示コンポーネント (UI)
 * データ取得中に表示するスケルトンローディングをラップします。
 */
export const LoadingState = () => {
  return <RepoListSkeleton />
}

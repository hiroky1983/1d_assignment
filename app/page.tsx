import { SearchScreen } from '@/screens/SearchScreen'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GitHub Repository Search',
  description: 'Search for GitHub repositories with Next.js App Router',
}

/**
 * ホームページ (Server Component)
 * 検索画面を表示します。
 */
export default function Page() {
  return <SearchScreen />
}

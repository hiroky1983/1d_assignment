import { env } from '@/lib/env'

import { RepoDetail } from '../types'

/**
 * GitHub APIからリポジトリの詳細情報を取得します。
 * サーバーサイドで直接呼び出すことを想定しています。
 *
 * @param owner リポジトリの所有者
 * @param name リポジトリ名
 * @returns リポジトリ詳細情報
 * @throws Error APIリクエストが失敗した場合
 */
export const getRepoDetail = async (
  owner: string,
  name: string,
): Promise<RepoDetail> => {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: {
      ...(env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` }
        : {}),
      Accept: 'application/vnd.github.v3+json',
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('NOT_FOUND')
    }
    const errorData = await res.json()
    throw new Error(errorData.message || 'GitHub API Error')
  }

  return res.json()
}

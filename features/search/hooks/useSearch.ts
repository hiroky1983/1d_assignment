import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'

import { SearchResponse } from '../types'

/**
 * 検索ロジックを管理するカスタムフック
 * URLパラメータ（q, page）と同期した検索状態、データ取得、ページネーション操作を提供します。
 *
 * @returns {Object} 検索状態と操作関数
 * @returns {string} query - 現在の検索文字列
 * @returns {Function} triggerSearch - 新しい検索を実行する関数
 * @returns {SearchResponse | undefined} data - 検索結果データ
 * @returns {Error | null} error - エラー状態
 * @returns {boolean} isLoading - 読み込み中かどうか（keepPreviousDataにより、ページ変更時はtrueになりません）
 * @returns {number} page - 現在のページ番号
 * @returns {Function} setPage - ページを変更する関数
 */
export const useSearch = () => {
  const searchParams = useSearchParams()
  const page = useMemo(
    () => Number(searchParams.get('page')) || 1,
    [searchParams],
  )
  const query = useMemo(() => searchParams.get('q') || '', [searchParams])

  const [previousQuery, setPreviousQuery] = useState('')

  /**
   * 検索APIのURLを構築します
   * @param params 現在のURLパラメータ
   * @returns 構築されたAPIのURL、またはクエリがない場合はnull
   */
  const buildSearchUrl = (params: URLSearchParams) => {
    const q = params.get('q')
    if (!q) return null
    return `/api/search?${params.toString()}`
  }

  const { data, error, isLoading, mutate } = useSWR<SearchResponse>(
    buildSearchUrl(searchParams),
    fetcher,
    {
      keepPreviousData: !!query && query === previousQuery,
      revalidateOnFocus: false,
    },
  )

  useEffect(() => {
    if (query && !isLoading) setPreviousQuery(query)
  }, [query, isLoading])

  /**
   * 検索状態を完全にリセットします
   * URLを初期化し、SWRのキャッシュをクリアします。
   */
  const clearSearch = useCallback(() => {
    window.history.pushState(null, '', '/')
    mutate(undefined, { revalidate: false })
  }, [mutate])

  /**
   * ユーザー入力に基づき即座に検索を実行します
   * URLの情報を更新することで、useSWRのフェッチをトリガーします。
   * @param query 検索文字列
   */
  const handleImmediateSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
        params.set('page', '1') // 新しい検索なら1ページ目に戻す
      } else {
        params.delete('q')
        params.delete('page')
      }

      const queryString = params.toString()
      const newUrl = queryString ? `/?${queryString}` : '/'
      window.history.pushState(null, '', newUrl)
    },
    [searchParams],
  )

  /**
   * 指定されたページへ遷移します
   * router.pushの代わりにpushStateを使用することで、高速にURLのみを更新します。
   * @param newPage 遷移先のページ番号
   */
  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', newPage.toString())
      params.set('per_page', '20')

      const newUrl = `/?${params.toString()}`
      window.history.pushState(null, '', newUrl)
    },
    [searchParams],
  )

  return {
    query,
    triggerSearch: handleImmediateSearch,
    clearSearch,
    data,
    error,
    isLoading,
    page,
    setPage,
  }
}

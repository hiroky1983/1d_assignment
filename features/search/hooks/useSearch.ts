import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'

import { SearchResponse } from '../types'

export const useSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = useMemo(
    () => Number(searchParams.get('page')) || 1,
    [searchParams],
  )
  const query = useMemo(() => searchParams.get('q') || '', [searchParams])

  // 汎用的にURLパラメータを構築
  const buildSearchUrl = (params: URLSearchParams) => {
    const q = params.get('q')
    if (!q) return null
    return `/api/search?${params.toString()}`
  }

  const { data, error, isLoading } = useSWR<SearchResponse>(
    buildSearchUrl(searchParams),
    fetcher,
    {
      keepPreviousData: !!searchParams, // Only keep previous data if we are fetching a new valid URL
      revalidateOnFocus: false,
    },
  )

  // 汎用的な検索実行関数
  const handleImmediateSearch = useCallback(
    (query: string) => {
      if (query) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', query)
        params.set('page', '1') // 新しい検索なら1ページ目に戻す

        router.push(`/?${params.toString()}`)
      } else {
        router.push('/')
      }
    },
    [router, searchParams],
  )

  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', newPage.toString())
      params.set('per_page', '20')
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams],
  )

  return {
    query,
    triggerSearch: handleImmediateSearch,
    data,
    error,
    isLoading,
    page,
    setPage,
  }
}

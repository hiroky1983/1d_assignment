import useSWR from 'swr'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

import { SearchResponse } from '../types'
import { fetcher } from '@/lib/fetcher'

export function useSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)

  // Sync URL -> State (e.g. navigation buttons)
  useEffect(() => {
    const urlQ = searchParams.get('q') || ''
    if (urlQ !== query) {
      setQuery(urlQ)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const page = Number(searchParams.get('page')) || 1

  // 汎用的にURLパラメータを構築
  const buildSearchUrl = (params: URLSearchParams) => {
    const q = params.get('q')
    if (!q) return null
    return `/api/search?${params.toString()}`
  }

  const url = buildSearchUrl(searchParams)

  const { data, error, isLoading } = useSWR<SearchResponse>(url, fetcher, {
    keepPreviousData: !!url, // Only keep previous data if we are fetching a new valid URL
    revalidateOnFocus: false,
  })

  // 汎用的な検索実行関数
  const handleImmediateSearch = useCallback(
    (term: string) => {
      setQuery(term)

      if (term) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', term)
        params.set('page', '1') // 新しい検索なら1ページ目に戻す

        router.push(`/?${params.toString()}`)
      } else {
        router.push('/')
      }
    },
    [router, searchParams],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', newPage.toString())
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams],
  )

  return {
    query,
    setQuery: (term: string) => setQuery(term),
    triggerSearch: handleImmediateSearch,
    data,
    error,
    isLoading: isLoading,
    page,
    setPage: handlePageChange,
  }
}

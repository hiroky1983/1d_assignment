import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'

import { SearchResponse } from '../types'

/**
 * 検索機能のカスタムフック
 * URLをSingle Source of Truthとして扱い、useEffectを使わずにderived stateで実装
 */
export function useSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ URLから直接導出（useEffect不要）
  const query = useMemo(() => searchParams.get('q') || '', [searchParams])
  const page = useMemo(() => Number(searchParams.get('page')) || 1, [searchParams])

  // ✅ URLパラメータ構築をメモ化
  const url = useMemo(() => {
    const q = searchParams.get('q')
    if (!q) return null
    return `/api/search?${searchParams.toString()}`
  }, [searchParams])

  const { data, error, isLoading } = useSWR<SearchResponse>(url, fetcher, {
    keepPreviousData: !!url,
    revalidateOnFocus: false,
  })

  // ✅ 子コンポーネントに渡すためuseCallback
  const triggerSearch = useCallback(
    (term: string) => {
      if (term) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', term)
        params.set('page', '1')
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
    triggerSearch,
    data,
    error,
    isLoading,
    page,
    setPage,
  }
}

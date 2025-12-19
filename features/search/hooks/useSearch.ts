import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchResponse } from '../types';
import { fetcher } from '@/lib/fetcher';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 1000); // Increased debounce to 1s as per README (1~2 sec)
  
  // Track if we should sync URL (avoid syncing on initial load if empty?)
  // Effect to sync Debounced Query -> URL
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    
    // If debounced query matches current URL, do nothing (avoid loop/replace)
    // If query is empty and URL is empty, do nothing.
    if (debouncedQuery !== currentQ) {
         // If query became empty, clear param
         if (!debouncedQuery && currentQ) {
             router.replace('/');
         } else if (debouncedQuery) {
             const params = new URLSearchParams(searchParams.toString());
             params.set('q', debouncedQuery);
             params.set('page', '1');
             router.replace(`/?${params.toString()}`);
         }
    }
  }, [debouncedQuery, router, searchParams]);

  // Sync URL -> State (e.g. navigation buttons)
  useEffect(() => {
      const urlQ = searchParams.get('q') || '';
      if (urlQ !== query && urlQ !== debouncedQuery) {
          setQuery(urlQ);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); 


  const page = Number(searchParams.get('page')) || 1;
  const url = debouncedQuery ? `/api/search?q=${encodeURIComponent(debouncedQuery)}&page=${page}` : null;

  const { data, error, isLoading } = useSWR<SearchResponse>(url, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const handleSearch = useCallback((term: string) => {
    setQuery(term);
  }, []);

  const handleImmediateSearch = useCallback((term: string) => {
      setQuery(term);
      // Force URL update immediately to trigger SWR
      // (Bypassing debounce wait)
      if (term) {
           const params = new URLSearchParams(searchParams.toString());
           params.set('q', term);
           params.set('page', '1');
           router.push(`/?${params.toString()}`);
      }
  }, [router, searchParams]);

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  return {
    query,
    setQuery: handleSearch,
    triggerSearch: handleImmediateSearch,
    data,
    error,
    isLoading: isLoading,
    page,
    setPage: handlePageChange,
  };
}

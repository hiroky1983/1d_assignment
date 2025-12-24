import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSearch } from './useSearch'

// Mock next/navigation
const mockSearchParams = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}))

// Mock useSWR
vi.mock('swr', () => ({
  default: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    mutate: vi.fn(),
  })),
}))

describe('useSearch', () => {
  it('should return default values', () => {
    mockSearchParams.delete('q')
    mockSearchParams.delete('page')

    const { result } = renderHook(() => useSearch())

    expect(result.current.query).toBe('')
    expect(result.current.page).toBe(1)
  })

  it('should return values from search params', () => {
    mockSearchParams.set('q', 'test')
    mockSearchParams.set('page', '2')

    const { result } = renderHook(() => useSearch())

    expect(result.current.query).toBe('test')
    expect(result.current.page).toBe(2)
  })

  it('should update URL on triggerSearch', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState')
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.triggerSearch('new-query')
    })

    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/?q=new-query&page=1')
    pushStateSpy.mockRestore()
  })

  it('should update URL on setPage', () => {
    mockSearchParams.set('q', 'test')
    const pushStateSpy = vi.spyOn(window.history, 'pushState')
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setPage(3)
    })

    expect(pushStateSpy).toHaveBeenCalledWith(
      null,
      '',
      '/?q=test&page=3&per_page=20',
    )
    pushStateSpy.mockRestore()
  })
})

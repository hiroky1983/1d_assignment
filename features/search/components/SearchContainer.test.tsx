import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSearch } from '@/features/search/hooks/useSearch'

import { SearchContainer } from './SearchContainer'

// Mock useSearch hook
vi.mock('@/features/search/hooks/useSearch', () => ({
  useSearch: vi.fn(),
}))

describe('SearchContainer', () => {
  it('should render loading state', () => {
    vi.mocked(useSearch).mockReturnValue({
      query: 'test',
      triggerSearch: vi.fn(),
      clearSearch: vi.fn(),
      data: undefined,
      error: null,
      isLoading: true,
      page: 1,
      setPage: vi.fn(),
    })

    render(<SearchContainer />)
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
  })

  it('should render error state', () => {
    vi.mocked(useSearch).mockReturnValue({
      query: 'test',
      triggerSearch: vi.fn(),
      clearSearch: vi.fn(),
      data: undefined,
      error: new Error('GitHub API Error'),
      isLoading: false,
      page: 1,
      setPage: vi.fn(),
    })

    render(<SearchContainer />)
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
    expect(screen.getByText('GitHub API Error')).toBeInTheDocument()
  })

  it('should render empty state', () => {
    vi.mocked(useSearch).mockReturnValue({
      query: 'test',
      triggerSearch: vi.fn(),
      clearSearch: vi.fn(),
      data: { total_count: 0, items: [], incomplete_results: false },
      error: null,
      isLoading: false,
      page: 1,
      setPage: vi.fn(),
    })

    render(<SearchContainer />)
    expect(screen.getByText('No repositories found.')).toBeInTheDocument()
  })

  it('should render results matching the query', () => {
    vi.mocked(useSearch).mockReturnValue({
      query: 'test',
      triggerSearch: vi.fn(),
      clearSearch: vi.fn(),
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 1,
            node_id: 'n1',
            name: 'test-repo',
            full_name: 'user/test-repo',
            owner: { login: 'user', avatar_url: '' },
            html_url: '',
            description: 'desc',
            stargazers_count: 10,
            watchers_count: 10,
            forks_count: 5,
            open_issues_count: 0,
            language: 'JS',
          },
        ],
      },
      error: null,
      isLoading: false,
      page: 1,
      setPage: vi.fn(),
    })

    render(<SearchContainer />)
    expect(screen.getByText('Found 1 results')).toBeInTheDocument()
    expect(screen.getByText('test-repo')).toBeInTheDocument()
  })
})

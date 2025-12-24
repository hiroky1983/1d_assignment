import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getRepoDetail } from '../api/repo'
import { RepoDetail } from '../types'
import { RepoDetailView } from './RepoDetailView'

// Mock the API call
vi.mock('../api/repo', () => ({
  getRepoDetail: vi.fn(),
}))

describe('RepoDetailView', () => {
  const mockRepo: RepoDetail = {
    id: 1,
    node_id: 'n1',
    name: 'react',
    full_name: 'facebook/react',
    owner: {
      login: 'facebook',
      avatar_url: 'https://example.com/avatar.png',
    },
    html_url: 'https://github.com/facebook/react',
    description: 'A JavaScript library for building user interfaces',
    stargazers_count: 200000,
    watchers_count: 200000,
    subscribers_count: 5000,
    forks_count: 40000,
    open_issues_count: 1000,
    language: 'TypeScript',
    topics: ['react', 'frontend'],
  }

  it('renders repository details correctly', async () => {
    vi.mocked(getRepoDetail).mockResolvedValue(mockRepo)

    const paramsPromise = Promise.resolve({ owner: 'facebook', name: 'react' })

    // Server components are basically async functions returning JSX.
    // In Vitest/Testing Library, we can await the result of the component call.
    const component = await RepoDetailView({ paramsPromise })
    render(component)

    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('facebook')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(
      screen.getByText('A JavaScript library for building user interfaces'),
    ).toBeInTheDocument()
    expect(screen.getByText('200,000')).toBeInTheDocument() // Stars
    expect(screen.getByText('5,000')).toBeInTheDocument() // Watchers
    expect(screen.getByText('40,000')).toBeInTheDocument() // Forks
    expect(screen.getByText('1,000')).toBeInTheDocument() // Issues
    expect(
      screen.getByRole('link', { name: /View on GitHub/i }),
    ).toHaveAttribute('href', 'https://github.com/facebook/react')
  })

  it('renders "No description provided." when description is missing', async () => {
    const repoNoDesc: RepoDetail = { ...mockRepo, description: null }
    vi.mocked(getRepoDetail).mockResolvedValue(repoNoDesc)

    const paramsPromise = Promise.resolve({ owner: 'facebook', name: 'react' })
    const component = await RepoDetailView({ paramsPromise })
    render(component)

    expect(screen.getByText('No description provided.')).toBeInTheDocument()
  })
})

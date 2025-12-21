import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RepoList } from './RepoList'

const mockRepos = [
  {
    id: 1,
    node_id: 'n1',
    name: 'react',
    full_name: 'facebook/react',
    owner: {
      login: 'facebook',
      avatar_url: 'https://github.com/facebook.png',
    },
    html_url: 'https://github.com/facebook/react',
    description: 'A JavaScript library for building user interfaces',
    stargazers_count: 200000,
    watchers_count: 200000,
    forks_count: 40000,
    open_issues_count: 1000,
    language: 'JavaScript',
  },
  {
    id: 2,
    node_id: 'n2',
    name: 'vue',
    full_name: 'vuejs/vue',
    owner: {
      login: 'vuejs',
      avatar_url: 'https://github.com/vuejs.png',
    },
    html_url: 'https://github.com/vuejs/vue',
    description: null, // Test null description
    stargazers_count: 190000,
    watchers_count: 190000,
    forks_count: 30000,
    open_issues_count: 500,
    language: null, // Test null language
  },
]

describe('RepoList', () => {
  it('renders a list of repositories', () => {
    render(<RepoList repos={mockRepos} />)

    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('facebook')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(
      screen.getByText('A JavaScript library for building user interfaces'),
    ).toBeInTheDocument()

    expect(screen.getByText('vue')).toBeInTheDocument()
    expect(screen.getByText('vuejs')).toBeInTheDocument()
  })

  it('renders "No description available" when description is null', () => {
    render(<RepoList repos={mockRepos} />)
    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  it('does not render language tag when language is null', () => {
    const { queryByText } = render(<RepoList repos={[mockRepos[1]]} />)
    // Vue has null language in mockRepos
    expect(queryByText('TypeScript')).not.toBeInTheDocument()
    expect(queryByText('JavaScript')).not.toBeInTheDocument()
  })

  it('links to the correct detail page with search params', () => {
    render(
      <RepoList repos={[mockRepos[0]]} currentQuery="react" currentPage={2} />,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/repo/facebook/react?q=react&page=2')
  })
})

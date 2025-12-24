import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders with default message', () => {
    render(<EmptyState />)
    expect(screen.getByText('No repositories found.')).toBeInTheDocument()
    expect(
      screen.getByText('Try adjusting your search query.'),
    ).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<EmptyState message="Custom empty message" />)
    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
  })
})

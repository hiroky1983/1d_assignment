import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  it('renders loading state container', () => {
    render(<LoadingState />)
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
  })
})

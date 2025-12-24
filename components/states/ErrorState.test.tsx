import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('renders error message correctly', () => {
    const error = new Error('Test error message')
    render(<ErrorState error={error} />)

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('calls reset function when Try again button is clicked', () => {
    const error = new Error('Test error')
    const reset = vi.fn()
    render(<ErrorState error={error} reset={reset} />)

    const button = screen.getByText('Try again')
    fireEvent.click(button)

    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('does not render reset button if reset prop is not provided', () => {
    const error = new Error('Test error')
    render(<ErrorState error={error} />)

    expect(screen.queryByText('Try again')).not.toBeInTheDocument()
  })
})

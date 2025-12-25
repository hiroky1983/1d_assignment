import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('should not render when total pages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalCount={10}
        perPage={20}
        onPageChange={() => {}}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render correct page info', () => {
    render(
      <Pagination
        currentPage={2}
        totalCount={100}
        perPage={20}
        onPageChange={() => {}}
      />,
    )
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
  })

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={100}
        perPage={20}
        onPageChange={() => {}}
      />,
    )
    const prevButton = screen.getByLabelText('Previous page')
    expect(prevButton).toBeDisabled()
  })

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalCount={100}
        perPage={20}
        onPageChange={() => {}}
      />,
    )
    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toBeDisabled()
  })

  it('should call onPageChange when buttons are clicked', () => {
    const handlePageChange = vi.fn()
    render(
      <Pagination
        currentPage={2}
        totalCount={100}
        perPage={20}
        onPageChange={handlePageChange}
      />,
    )

    fireEvent.click(screen.getByLabelText('Previous page'))
    expect(handlePageChange).toHaveBeenCalledWith(1)

    fireEvent.click(screen.getByLabelText('Next page'))
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })

  it('should cap total pages at 50 (1000 items / 20 per page)', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={2000}
        perPage={20}
        onPageChange={() => {}}
      />,
    )
    expect(screen.getByText('Page 1 of 50')).toBeInTheDocument()
  })
})

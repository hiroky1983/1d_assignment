import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { SearchInput } from './SearchInput'

test('SearchInput triggers search on Button click', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput initialValue="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')
  const button = screen.getByText('Search')

  // Type into input (Uncontrolled component)
  fireEvent.change(input, { target: { value: 'test' } })

  // Click button -> submit
  fireEvent.click(button)

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledWith('test')
  })
})

test('SearchInput triggers search on Enter', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput initialValue="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')

  fireEvent.change(input, { target: { value: 'test' } })

  // Submit via Enter (form submit event)
  const form = input.closest('form')!
  fireEvent.submit(form)

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledWith('test')
  })
})

test('SearchInput prevents submit during IME composition', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput initialValue="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')

  // Simulate IME composition start
  fireEvent.compositionStart(input)
  fireEvent.change(input, { target: { value: 'tes' } })

  // Enter key down during composition -> Should NOT submit
  fireEvent.keyDown(input, { key: 'Enter' })

  // The component checks isComposing state and prevents default
  expect(handleSearch).not.toHaveBeenCalled()

  // End composition
  fireEvent.compositionEnd(input)

  // Now triggering submit should work
  const form = input.closest('form')!
  fireEvent.submit(form)

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledWith('tes')
  })
})

test('SearchInput shows validation error for long input', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput initialValue="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')
  const button = screen.getByText('Search')

  // Type a string longer than 100 characters
  const longQuery = 'a'.repeat(101)
  fireEvent.input(input, { target: { value: longQuery } })

  // Error message should appear
  await waitFor(() => {
    expect(screen.getByText('Max 100 characters allowed')).toBeInTheDocument()
  })

  // Button should be disabled
  expect(button).toBeDisabled()
})

test('SearchInput accepts valid input within 100 characters', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput initialValue="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')

  // Type a valid string
  const validQuery = 'a'.repeat(100)
  fireEvent.input(input, { target: { value: validQuery } })

  // No error message should appear
  await waitFor(() => {
    expect(screen.queryByText('Max 100 characters allowed')).not.toBeInTheDocument()
  })

  // Submit should work
  const form = input.closest('form')!
  fireEvent.submit(form)

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledWith(validQuery)
  })
})

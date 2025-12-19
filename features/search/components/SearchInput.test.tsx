import { expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchInput } from './SearchInput'

test('SearchInput updates value on change', () => {
  const handleChange = vi.fn()
  render(<SearchInput value="" onChange={handleChange} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')
  fireEvent.change(input, { target: { value: 'react' } })

  expect(handleChange).toHaveBeenCalledWith('react')
})

test('SearchInput handles IME composition correctly', () => {
  const handleChange = vi.fn()
  render(<SearchInput value="" onChange={handleChange} />)
  const input = screen.getByPlaceholderText('Search GitHub repositories...')

  // Start composition
  fireEvent.compositionStart(input)
  fireEvent.change(input, { target: { value: 'k' } })
  
  // Should NOT call onChange during composition
  expect(handleChange).not.toHaveBeenCalled()

  // End composition
  fireEvent.compositionEnd(input, { currentTarget: { value: 'k' } })
  // Now it should call
  expect(handleChange).toHaveBeenCalledWith('k')
})

test('SearchInput triggers immediate search on Enter', () => {
  const handleSearch = vi.fn()
  render(<SearchInput value="test" onChange={() => {}} onSearch={handleSearch} />)
  const input = screen.getByPlaceholderText('Search GitHub repositories...')

  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  expect(handleSearch).toHaveBeenCalledWith('test')
})

test('SearchInput triggers immediate search on Button click', () => {
  const handleSearch = vi.fn()
  render(<SearchInput value="test" onChange={() => {}} onSearch={handleSearch} />)
  
  const button = screen.getByText('Search')
  fireEvent.click(button)
  
  expect(handleSearch).toHaveBeenCalledWith('test')
})

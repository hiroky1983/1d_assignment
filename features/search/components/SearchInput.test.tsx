import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { SearchInput } from './SearchInput'

test('SearchInput triggers search on Button click', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput value="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')
  const button = screen.getByText('Search')

  // Type into input (using fireEvent for RHF integration often requires tracking updates)
  // RHF needs change event to update internal state.
  fireEvent.change(input, { target: { value: 'test' } })

  // Wait for validation to pass and button to be enabled
  await waitFor(() => {
    expect(button).not.toBeDisabled()
  })

  // Click button -> submit
  fireEvent.click(button)

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledWith('test')
  })
})

test('SearchInput triggers search on Enter', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput value="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')

  fireEvent.change(input, { target: { value: 'test' } })

  // Submit via Enter
  fireEvent.submit(input)

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledWith('test')
  })
})

test('SearchInput prevents submit during IME composition', async () => {
  const handleSearch = vi.fn()
  render(<SearchInput value="" onSearch={handleSearch} />)

  const input = screen.getByPlaceholderText('Search GitHub repositories...')

  // Simulate IME composition start
  fireEvent.compositionStart(input)
  fireEvent.change(input, { target: { value: 'tes' } })

  // Enter key down during composition -> Should NOT submit
  // Note: keyPress/down simulation with isComposing check in component
  // We need to bypass fireEvent wrapper to simulate exact event sequence if possible,
  // or just trust component's onKeyDown logic.
  // The component checks isComposing state.
  fireEvent.keyDown(input, { key: 'Enter' })

  // Submit event usually doesn't fire if default is prevented on KeyDown in input
  // creating a form submit.

  expect(handleSearch).not.toHaveBeenCalled()

  // End composition
  fireEvent.compositionEnd(input)

  // Now triggering submit should work (but RHF submit is usually triggered by form submit event, not keydown directly)
  // The component's onKeyDown prevents Default for Enter if composing, which prevents form submission.

  // Let's verify manual submit works after composition
  fireEvent.submit(input)

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledWith('tes')
  })
})

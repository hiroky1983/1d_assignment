import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Header } from '@/components/layout/Header'

test('Header renders correctly', () => {
  render(<Header />)
  expect(screen.getByText('GitHub Search')).toBeDefined()
})

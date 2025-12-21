import { describe, expect, it } from 'vitest'

import { searchParamsSchema } from './index'

describe('searchParamsSchema', () => {
  it('should validate valid search parameters', () => {
    const validParams = {
      q: 'react',
      page: '1',
      per_page: '20',
    }
    const result = searchParamsSchema.safeParse(validParams)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.q).toBe('react')
      expect(result.data.page).toBe(1)
      expect(result.data.per_page).toBe(20)
    }
  })

  it('should use default values for missing page and per_page', () => {
    const result = searchParamsSchema.safeParse({ q: 'react' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.per_page).toBe(20)
    }
  })

  it('should fail if query is longer than 100 characters', () => {
    const result = searchParamsSchema.safeParse({
      q: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.q).toContain(
        'Max 100 characters allowed',
      )
    }
  })

  it('should fail if page is not a positive integer', () => {
    const result = searchParamsSchema.safeParse({
      q: 'react',
      page: '0',
    })
    expect(result.success).toBe(false)

    const result2 = searchParamsSchema.safeParse({
      q: 'react',
      page: '-1',
    })
    expect(result2.success).toBe(false)
  })

  it('should coerce string numbers to numeric types', () => {
    const result = searchParamsSchema.safeParse({
      q: 'react',
      page: '5',
      per_page: '30',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(5)
      expect(result.data.per_page).toBe(30)
    }
  })
})

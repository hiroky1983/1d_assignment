import { test, expect } from '@playwright/test'

test.describe('Security & Bot Protection', () => {
  test('Client-side validation: Max length 100', async ({ page }) => {
    await page.goto('/')

    // Create a string longer than 100 chars
    const longQuery = 'a'.repeat(101)

    // Type into input
    const searchInput = page.getByPlaceholder('Search GitHub repositories...')
    await searchInput.fill(longQuery)

    // Validation error should appear immediately (onChange mode)
    await expect(page.getByText('Max 100 characters allowed')).toBeVisible()

    // Button should be disabled
    await expect(page.getByRole('button', { name: 'Search' })).toBeDisabled()

    // Try to press Enter (should not submit)
    await searchInput.press('Enter')

    // URL should NOT change (submission blocked)
    expect(page.url()).not.toContain('?q=')
  })

  // Note: Rate limit test is tricky in shared environment.
  // We can try to trigger it by hitting the API endpoint directly via request context.
  test('Server-side: Rate limit (429) protection', async ({ request }) => {
    // Send 15 requests quickly (limit is 10 per 10 seconds)
    // Note: This might affect other tests or be flaky if limit is shared.
    // Ideally use a separate test env or mock strict rate limit behavior.

    let rateLimited = false

    for (let i = 0; i < 15; i++) {
      const response = await request.get('/api/search?q=test')
      if (response.status() === 429) {
        rateLimited = true
        break
      }
    }

    expect(rateLimited).toBe(true)
  })
})

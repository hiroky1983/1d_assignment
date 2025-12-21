import { expect, test } from '@playwright/test'

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
    // Generate a random IP to isolate this test run from others
    const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

    let rateLimited = false

    // Send 15 requests quickly (limit is 10 per 10 seconds)
    for (let i = 0; i < 15; i++) {
      const response = await request.get('/api/search?q=test', {
        headers: {
          'X-Forwarded-For': randomIp,
        },
      })

      if (response.status() === 429) {
        rateLimited = true
        break
      }
    }

    expect(rateLimited).toBe(true)
  })
})

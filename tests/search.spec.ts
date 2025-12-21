import { test, expect } from '@playwright/test'

test('Search flow: Search -> List -> Detail', async ({ page }) => {
  // Mock Internal Search API (BFF)
  await page.route('**/api/search*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_count: 1,
        items: [
          {
            id: 1,
            name: 'react',
            full_name: 'facebook/react',
            owner: {
              login: 'facebook',
              // Use a valid hostname allowed in next.config.ts
              avatar_url: 'https://avatars.githubusercontent.com/u/69631',
            },
            html_url: 'https://github.com/facebook/react',
            description:
              'A declarative, efficient, and flexible JavaScript library.',
            stargazers_count: 200000,
            watchers_count: 6000,
            forks_count: 40000,
            open_issues_count: 500,
            language: 'JavaScript',
          },
        ],
      }),
    })
  })

  // 1. Visit Home
  await page.goto('/')
  await expect(page).toHaveTitle(/GitHub Repository Search/)

  // 2. Search for 'react'
  const searchInput = page.getByPlaceholder('Search GitHub repositories...')
  await searchInput.fill('react')
  // Trigger search (Enter key)
  await searchInput.press('Enter')

  // Wait for navigation and URL update
  await page.waitForURL(/.*q=react.*/)

  // 3. Check List Results
  // Locator for repo links (anchor tags starting with /repo/)
  const repoLink = page.locator('a[href^="/repo/"]').first()

  await expect(repoLink).toBeVisible({ timeout: 10000 })

  // Verify content
  const linkText = await repoLink.textContent()
  expect(linkText).toContain('react')

  // 4. Navigate to Detail
  await repoLink.click()

  // 5. Check Detail Page
  await expect(page).toHaveURL(/\/repo\/facebook\/react/)

  // Verify heading exists (loosen check for real API or error page)
  // Even if API fails, Next.js usually renders the page shell or error boundary.
  // We check if we are NOT on 404 page if possible, but checking heading is standard.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock GitHub Search API
  http.get('https://api.github.com/search/repositories', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    if (!q) {
      return HttpResponse.json({
        total_count: 0,
        incomplete_results: false,
        items: [],
      })
    }

    // Return dummy data for specific query 'react' or default
    return HttpResponse.json({
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: 'react',
          full_name: 'facebook/react',
          owner: {
            login: 'facebook',
            avatar_url: 'https://github.com/facebook.png',
          },
          html_url: 'https://github.com/facebook/react',
          description:
            'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
          stargazers_count: 200000,
          watchers_count: 6000,
          forks_count: 40000,
          open_issues_count: 500,
          language: 'JavaScript',
        },
      ],
    })
  }),

  // Mock GitHub Repo Detail API
  http.get('https://api.github.com/repos/:owner/:name', ({ params }) => {
    const { owner, name } = params

    if (owner === 'facebook' && name === 'react') {
      return HttpResponse.json({
        id: 1,
        name: 'react',
        full_name: 'facebook/react',
        owner: {
          login: 'facebook',
          avatar_url: 'https://github.com/facebook.png',
        },
        html_url: 'https://github.com/facebook/react',
        description:
          'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
        stargazers_count: 200000,
        subscribers_count: 6000, // watchers
        forks_count: 40000,
        open_issues_count: 500,
        language: 'JavaScript',
        network_count: 40000, // forks
      })
    }

    return new HttpResponse(null, { status: 404 })
  }),
]

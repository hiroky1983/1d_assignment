export interface FetchError extends Error {
  info?: unknown
  status?: number
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options)

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as FetchError
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

import { LRUCache } from 'lru-cache'

interface RateLimitOptions {
  uniqueTokenPerInterval?: number // Max unique IPs (cache size)
  interval?: number // Window size in ms
}

export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number) || 0
      const currentUsage = tokenCount + 1
      tokenCache.set(token, currentUsage)

      const isRateLimited = currentUsage > limit

      return {
        isRateLimited,
        currentUsage,
        limit,
      }
    },
  }
}

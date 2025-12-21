import { LRUCache } from 'lru-cache'

/**
 * レート制限の設定オプション
 */
interface RateLimitOptions {
  /** キャッシュに保存する一意のトークン（IP）の最大数 (default: 500) */
  uniqueTokenPerInterval?: number
  /** レート制限のウィンドウサイズ（ミリ秒） (default: 60000) */
  interval?: number
}

/**
 * トークンベースのレート制限を提供するユーティリティを作成
 * LRUキャッシュを使用して、指定された時間ウィンドウ内のリクエスト数を追跡します
 *
 * @param options - レート制限の設定オプション
 * @returns check メソッドを持つオブジェクト
 *
 * @example
 * const limiter = rateLimit({ interval: 10000, uniqueTokenPerInterval: 500 })
 * const result = limiter.check(10, '192.168.1.1')
 * if (result.isRateLimited) {
 *   // リクエストを拒否
 * }
 */
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

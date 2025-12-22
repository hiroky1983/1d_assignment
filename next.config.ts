import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // セキュリティ: X-Powered-By ヘッダーを無効化
  poweredByHeader: false,

  // 画像設定
  images: {
    // AVIFを優先して転送量を削減
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // コンパイラ設定
  compiler: {
    // 本番環境ビルド時に console.log を削除（error/warn は残す）
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  // 開発時のフェッチログを見やすくする
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  cacheComponents: true,
}

export default nextConfig

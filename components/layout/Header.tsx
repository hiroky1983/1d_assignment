import React from 'react'
import Link from 'next/link'

/**
 * 共通ヘッダーコンポーネント (UI)
 * 全ページ共通のナビゲーションヘッダーを表示します。
 */
export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 p-4 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent"
        >
          GitHub Search
        </Link>
      </div>
    </header>
  )
}

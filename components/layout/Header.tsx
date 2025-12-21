import Link from 'next/link'

/**
 * 共通ヘッダーコンポーネント (UI)
 * 全ページ共通のナビゲーションヘッダーを表示します。
 */
export const Header = () => {
  return (
    <header className="border-app-border bg-app-card/80 sticky top-0 z-50 border-b p-4 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="from-app-primary bg-linear-to-r to-violet-600 bg-clip-text text-xl font-bold text-transparent"
        >
          GitHub Search
        </Link>
      </div>
    </header>
  )
}

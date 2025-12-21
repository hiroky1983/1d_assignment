import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

/**
 * 404 ページ (Server Component)
 * 存在しないページがリクエストされた場合に表示されます。
 */
export default function NotFound() {
  return (
    <div className="bg-app-bg flex min-h-screen flex-col font-sans">
      <main className="flex grow flex-col items-center justify-center p-4">
        <div className="text-center">
          <FileQuestion className="text-app-text-disabled mx-auto mb-6 h-24 w-24" />
          <h2 className="text-app-text-main mb-4 text-3xl font-bold">
            Page Not Found
          </h2>
          <p className="text-app-text-muted mx-auto mb-8 max-w-md">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>
          <Link
            href="/"
            className="bg-app-primary text-app-primary-foreground inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium transition-colors hover:opacity-90"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  )
}

import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

/**
 * 404 ページ (Server Component)
 * 存在しないページがリクエストされた場合に表示されます。
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      <main className="flex grow flex-col items-center justify-center p-4">
        <div className="text-center">
          <FileQuestion className="mx-auto mb-6 h-24 w-24 text-gray-300" />
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mx-auto mb-8 max-w-md text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  )
}

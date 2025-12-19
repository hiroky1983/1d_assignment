import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

/**
 * 404 ページ (Server Component)
 * 存在しないページがリクエストされた場合に表示されます。
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="grow flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <FileQuestion className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  )
}

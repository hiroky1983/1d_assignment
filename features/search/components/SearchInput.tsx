import { Search } from 'lucide-react'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'

interface SearchInputProps {
  initialValue?: string
  onSearch?: (value: string) => void
  isLoading?: boolean
}

/**
 * 検索入力フォームコンポーネント (Uncontrolled Input)
 * useEffectを使わず、defaultValueとFormDataでシンプルに実装
 * IME制御を行い、Enter送信を適切に処理します。
 */
export const SearchInput = ({
  initialValue = '',
  onSearch,
  isLoading,
}: SearchInputProps) => {
  const [isComposing, setIsComposing] = useState(false)
  const [error, setError] = useState('')

  /**
   * フォーム送信ハンドラ
   * FormDataからクエリを取得し、バリデーション後に検索を実行
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = (formData.get('query') as string).trim()

    if (query.length > 100) {
      setError('Max 100 characters allowed')
      return
    }

    setError('')
    if (!isComposing && query) {
      onSearch?.(query)
    }
  }

  /**
   * 入力時バリデーション
   * リアルタイムで100文字制限をチェック
   */
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (value.length > 100) {
      setError('Max 100 characters allowed')
    } else {
      setError('')
    }
  }

  /**
   * Enterキーハンドラ
   * IME変換中のEnter送信を防止
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isComposing) {
      e.preventDefault()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="group relative w-full max-w-4xl">
      <div className="from-app-primary absolute -inset-1 rounded-lg bg-linear-to-r to-violet-600 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
      <div className="relative">
        <Search className="text-app-text-muted pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
        <input
          type="search"
          name="query"
          defaultValue={initialValue}
          onInput={handleInput}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          maxLength={101}
          placeholder="Search GitHub repositories..."
          aria-label="Search GitHub repositories"
          className={cn(
            'border-app-border bg-app-card text-app-text-main w-full rounded-lg border p-4 pr-24 pl-12 text-lg shadow-xl',
            'focus:ring-app-primary transition-all duration-300 outline-none focus:border-transparent focus:ring-2',
            'placeholder-app-text-muted disabled:opacity-50',
          )}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-app-primary text-app-primary-foreground absolute top-1/2 right-2 -translate-y-1/2 transform rounded-md px-4 py-2 transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading || !!error}
        >
          Search
        </button>
        {isLoading && (
          <div className="absolute top-1/2 right-24 mr-2 -translate-y-1/2 transform">
            <div className="border-app-primary h-5 w-5 animate-spin rounded-full border-b-2"></div>
          </div>
        )}
      </div>
      {error && <p className="text-app-error mt-2 text-sm">{error}</p>}
    </form>
  )
}

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onSearch?: (value: string) => void
  isLoading?: boolean
}

interface FormValues {
  query: string
}

/**
 * 検索入力フォームコンポーネント (React Hook Form)
 * フォーム送信、無駄な再レンダリング抑制、IME制御を行います。
 */
export const SearchInput = ({
  value,
  onSearch,
  isLoading,
}: SearchInputProps) => {
  const [isComposing, setIsComposing] = useState(false)

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: { query: value },
  })

  // Watch query to detect clear ('x' button usage)
  const queryValue = watch('query')

  // URL (parent prop) changes -> Update form value
  // We only want to update if the PARENT triggers a change (e.g. browser back button).
  // We do NOT want to update if the user is just typing locally.
  // Since 'value' prop only updates on SEARCH submission, it remains stale during typing.
  // If we add 'value' to dependency array, it's fine because 'value' doesn't change during typing.
  // BUT we must NOT add 'queryValue' to dependency array.
  useEffect(() => {
    setValue('query', value)
  }, [value, setValue])

  // Monitor Empty Value (for 'x' button clear support)
  useEffect(() => {
    // Only trigger if it BECAME empty (and was not just initialized empty)
    // However, purely relying on useEffect for x-button is tricky with RHF.
    // The previous infinite loop was: Empty -> onSearch -> Re-render -> Empty -> onSearch...

    // We only want to trigger search if user CLEARS it.
    // But distinguishing user clear vs initial empty is hard here.
    // Let's rely on onSubmit for explicit searches, and only use this effect if we are sure.

    // Simple fix: Check if we are already safely synced? No.
    // The issue is onSearch('') triggers a navigation which re-renders this component.

    // Better strategy for 'x' button:
    // If the browser clears the input, 'queryValue' becomes ''.
    // We should only call onSearch('') if the current 'value' (prop) is NOT empty.

    if (queryValue === '' && value !== '') {
      onSearch?.('')
    }
  }, [queryValue, onSearch, value])

  const onSubmit = (data: FormValues) => {
    // Prevent submit if strictly necessary, but usually RHF handles Submit only on valid enter
    onSearch?.(data.query)
  }

  // Prevent Enter submit during IME composition
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isComposing) {
      e.preventDefault()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="group relative w-full max-w-2xl"
    >
      <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-600 to-violet-600 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <input
          type="search"
          {...register('query')}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search GitHub repositories..."
          className={cn(
            'w-full rounded-lg border border-gray-200 bg-white p-4 pr-24 pl-12 text-lg shadow-xl',
            'transition-all duration-300 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500',
            'placeholder-gray-400 disabled:opacity-50',
          )}
          disabled={isLoading && !queryValue}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading || !queryValue}
        >
          Search
        </button>
        {isLoading && (
          <div className="absolute top-1/2 right-24 mr-2 -translate-y-1/2 transform">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </form>
  )
}

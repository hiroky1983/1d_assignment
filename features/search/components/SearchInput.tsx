import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'

interface SearchInputProps {
  onSearch?: (value: string) => void
  onClear?: () => void
  isLoading?: boolean
  defaultValue?: string
}

interface FormValues {
  query: string
}

const VALIDATION_ERROR_MESSAGE = 'Max 100 characters allowed'

/**
 * 検索入力フォームコンポーネント (React Hook Form)
 * フォーム送信、無駄な再レンダリング抑制、IME制御を行います。
 */
export const SearchInput = ({
  onSearch,
  onClear,
  isLoading,
  defaultValue = '',
}: SearchInputProps) => {
  const [isComposing, setIsComposing] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: { query: defaultValue },
    mode: 'onChange',
  })

  const queryValue = watch('query')

  return (
    <form
      onSubmit={handleSubmit((data: FormValues) => onSearch?.(data.query))}
      className="group relative w-full max-w-4xl"
    >
      <div className="from-app-primary absolute -inset-1 rounded-lg bg-linear-to-r to-violet-600 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
      <div className="relative">
        <Search className="text-app-text-muted pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
        <input
          type="search"
          {...register('query', {
            validate: (value) =>
              value.length <= 100 || VALIDATION_ERROR_MESSAGE,
          })}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && isComposing) {
              e.preventDefault()
            }
          }}
          placeholder="Search GitHub repositories..."
          aria-label="Search GitHub repositories"
          className={cn(
            'border-app-border bg-app-card text-app-text-main w-full rounded-lg border p-4 pr-32 pl-12 text-lg shadow-xl',
            'focus:ring-app-primary transition-all duration-300 outline-none focus:border-transparent focus:ring-2',
            'placeholder-app-text-muted disabled:opacity-50',
            // ブラウザ標準のバツボタンを非表示にする
            '[&::-webkit-search-cancel-button]:hidden',
          )}
          disabled={isLoading}
        />

        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center gap-2">
          {queryValue && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setValue('query', '', { shouldValidate: true })
                onClear?.()
              }}
              className="text-app-text-muted hover:text-app-text-main p-2 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <button
            type="submit"
            className="bg-app-primary text-app-primary-foreground rounded-md px-4 py-2 transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || !isValid}
          >
            Search
          </button>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 right-24 mr-2 -translate-y-1/2 transform">
            <div className="border-app-primary h-5 w-5 animate-spin rounded-full border-b-2"></div>
          </div>
        )}
      </div>
      {errors.query && (
        <p className="text-app-error mt-2 text-sm">{errors.query.message}</p>
      )}
    </form>
  )
}

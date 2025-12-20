import React, {
  useState,
  useEffect,
  KeyboardEvent,
  CompositionEvent,
} from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void // Immediate search trigger
  isLoading?: boolean
}

/**
 * 検索入力フォームコンポーネント (UI/Interaction)
 * テキスト入力、IME入力制御、検索トリガーイベントをハンドルします。
 */
export const SearchInput = ({
  value,
  onChange,
  onSearch,
  isLoading,
}: SearchInputProps) => {
  const [innerValue, setInnerValue] = useState(value)
  const [isComposing, setIsComposing] = useState(false)

  // Sync internal state with external prop (e.g. URL changes)
  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInnerValue(newValue)
    if (!isComposing) {
      onChange(newValue)
    }
  }

  const handleCompositionStart = () => setIsComposing(true)

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    onChange(e.currentTarget.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      onSearch?.(innerValue)
    }
  }

  return (
    <div className="group relative w-full max-w-2xl">
      <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-600 to-violet-600 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <input
          type="search"
          value={innerValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder="Search GitHub repositories..."
          className={cn(
            'w-full rounded-lg border border-gray-200 bg-white p-4 pr-24 pl-12 text-lg shadow-xl',
            'transition-all duration-300 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500',
            'placeholder-gray-400 disabled:opacity-50',
          )}
          disabled={isLoading && !innerValue}
        />
        <button
          onClick={() => onSearch?.(innerValue)}
          className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading || !innerValue}
        >
          Search
        </button>
        {isLoading && (
          <div className="absolute top-1/2 right-24 mr-2 -translate-y-1/2 transform">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  )
}

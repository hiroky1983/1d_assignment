import React, { useState, useEffect, KeyboardEvent, CompositionEvent } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void; // Immediate search trigger
  isLoading?: boolean;
}

/**
 * 検索入力フォームコンポーネント (UI/Interaction)
 * テキスト入力、IME入力制御、検索トリガーイベントをハンドルします。
 */
export const SearchInput = ({ value, onChange, onSearch, isLoading }: SearchInputProps) => {
  const [innerValue, setInnerValue] = useState(value);
  const [isComposing, setIsComposing] = useState(false);

  // Sync internal state with external prop (e.g. URL changes)
  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInnerValue(newValue);
    if (!isComposing) {
      onChange(newValue);
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  
  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    onChange(e.currentTarget.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      onSearch?.(innerValue);
    }
  };

  return (
    <div className="w-full max-w-2xl relative group">
      <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          type="search"
          value={innerValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder="Search GitHub repositories..."
          className={cn(
            "w-full p-4 pl-12 pr-24 text-lg rounded-lg border border-gray-200 bg-white shadow-xl",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300",
            "placeholder-gray-400 disabled:opacity-50"
          )}
          disabled={isLoading && !innerValue}
        />
        <button
          onClick={() => onSearch?.(innerValue)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !innerValue}
        >
          Search
        </button>
        {isLoading && (
            <div className="absolute right-24 top-1/2 transform -translate-y-1/2 mr-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
        )}
      </div>
    </div>
  );
};

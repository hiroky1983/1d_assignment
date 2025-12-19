import React from 'react';
import { SearchX } from 'lucide-react';

export function EmptyState({ message = "No repositories found." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <SearchX className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm mt-2">Try adjusting your search query.</p>
    </div>
  );
}

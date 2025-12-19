import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-violet-600">
          GitHub Search
        </Link>
      </div>
    </header>
  );
}

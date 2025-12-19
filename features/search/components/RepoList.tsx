import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { GitHubRepo } from '../types';
import { Skeleton } from '@/components/ui/Skeleton';

interface RepoListProps {
  repos: GitHubRepo[];
}

export function RepoList({ repos }: RepoListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mt-8">
      {repos.map((repo) => (
        <Link 
          key={repo.id} 
          href={`/repo/${repo.owner.login}/${repo.name}`}
          className="block group h-full"
        >
          <article className="h-full p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
            <div className="flex items-center mb-4">
              <Image 
                src={repo.owner.avatar_url} 
                alt={`${repo.owner.login} avatar`}
                width={40}
                height={40}
                className="rounded-full mr-3 border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {repo.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {repo.owner.login}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3 grow">
              {repo.description || 'No description available'}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-50">
              <div className="flex items-center space-x-4">
                <span className="flex items-center" title="Stars">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  {repo.stargazers_count.toLocaleString()}
                </span>
                {repo.language && (
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2 opacity-75"></span>
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

export function RepoListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mt-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 h-64 flex flex-col">
          <div className="flex items-center mb-4">
            <Skeleton className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="mt-auto pt-4 flex justify-between">
             <Skeleton className="h-4 w-1/4" />
             <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

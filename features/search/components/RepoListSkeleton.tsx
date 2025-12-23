import { Skeleton } from '@/components/ui/Skeleton'

/**
 * リポジトリ一覧のスケルトンローディング (UI)
 */
export const RepoListSkeleton = () => {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border-app-border bg-app-card flex flex-col gap-4 rounded-xl border p-6 sm:flex-row"
        >
          <div className="shrink-0">
            <Skeleton className="h-12 w-12 rounded-full sm:h-14 sm:w-14" />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-baseline gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-2/3" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

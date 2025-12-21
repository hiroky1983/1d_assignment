import { cn } from '@/lib/utils'

/**
 * スケルトンローディングコンポーネント (UI)
 * コンテンツ読み込み中のプレースホルダーとして表示します。
 */
const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('bg-app-border/80 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }

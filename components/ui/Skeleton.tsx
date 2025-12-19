import { cn } from "@/lib/utils"

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
      className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
      {...props}
    />
  )
}

export { Skeleton }

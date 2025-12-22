import { z } from 'zod'

import { repositorySchema } from '@/features/search/types'

export const repoDetailSchema = repositorySchema.extend({
  subscribers_count: z.number(), // For watchers (Github API logic)
  topics: z.array(z.string()),
})

export type RepoDetail = z.infer<typeof repoDetailSchema>

export const repoDetailResponseSchema = z.object({
  repo: repoDetailSchema,
})

export type RepoDetailResponse = z.infer<typeof repoDetailResponseSchema>

import { z } from 'zod'

export const repositorySchema = z.object({
  id: z.number(),
  node_id: z.string(),
  name: z.string(),
  full_name: z.string(),
  owner: z.object({
    login: z.string(),
    avatar_url: z.string(),
  }),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  html_url: z.string(),
})

export type Repository = z.infer<typeof repositorySchema>

export const searchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(repositorySchema),
})

export type SearchResponse = z.infer<typeof searchResponseSchema>

export const searchParamsSchema = z.object({
  q: z.string().max(100, { message: 'Max 100 characters allowed' }).optional(),
  page: z.coerce.number().int().positive().default(20),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

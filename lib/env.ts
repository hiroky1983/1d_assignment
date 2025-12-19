import { z } from 'zod'

const envSchema = z.object({
  GITHUB_TOKEN: z.string().optional(),
})

export const env = envSchema.parse({
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
})

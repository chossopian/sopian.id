import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string().optional(),
    category: z.enum(['AI & Automation', 'Web Development', 'Enterprise Systems', 'DevOps & Infrastructure', 'Other']),
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),
    period: z.string().optional(),
    coverImage: z.string().optional(),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    publishedAt: z.coerce.date().optional(),
  }),
});

export const collections = { projects };
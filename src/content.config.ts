import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Cada projeto é um arquivo em src/content/projects/.
 * - `destaque: 1 | 2 | 3` coloca o projeto nos cards do topo da home (na ordem do número).
 * - `caseStudy: true` gera a página /projetos/<arquivo> com o corpo do .mdx.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    code: z.string(), // P/01
    title: z.string(),
    desc: z.string(),
    topics: z.array(z.string()).max(4),
    base: z.string(), // stack principal
    order: z.number(),
    destaque: z.number().int().min(1).max(3).optional(),
    caseStudy: z.boolean().default(false),
    repo: z.string().url().optional(),
    // campos do estudo de caso
    eyebrow: z.string().optional(),
    lead: z.string().optional(),
    tags: z.array(z.object({ label: z.string(), tone: z.enum(['neutral', 'accent', 'signal', 'caution']).default('neutral') })).optional(),
    ficha: z.array(z.object({ k: z.string(), v: z.string() })).optional(),
    figura: z.object({ src: z.string().optional(), alt: z.string(), legenda: z.string(), data: z.string().optional() }).optional(),
  }),
});

export const collections = { projects };

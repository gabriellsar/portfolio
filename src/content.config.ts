import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tags = z.array(z.object({ label: z.string(), tone: z.enum(['neutral', 'accent', 'signal', 'caution']).default('neutral') }));
const ficha = z.array(z.object({ k: z.string(), v: z.string() }));

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
    app: z.string().url().optional(), // app no ar
    status: z.enum(['em-andamento']).optional(),
    // campos do estudo de caso
    eyebrow: z.string().optional(),
    lead: z.string().optional(),
    tags: tags.optional(),
    ficha: ficha.optional(),
    figura: z.object({ src: z.string().optional(), alt: z.string(), legenda: z.string(), data: z.string().optional() }).optional(),
  }),
});

/**
 * Versão em inglês dos projetos: mesmo nome de arquivo da versão em português.
 * Só leva os textos; ordem, links, destaque, status e imagens continuam vindo do arquivo em português.
 * O corpo do .mdx (estudo de caso) é a versão traduzida; sem arquivo aqui, a página em inglês usa o texto em português.
 */
const projectsEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects-en' }),
  schema: z.object({
    title: z.string().optional(),
    desc: z.string().optional(),
    topics: z.array(z.string()).max(4).optional(),
    base: z.string().optional(),
    eyebrow: z.string().optional(),
    lead: z.string().optional(),
    tags: tags.optional(),
    ficha: ficha.optional(),
    figura: z.object({ alt: z.string().optional(), legenda: z.string().optional(), data: z.string().optional() }).optional(),
  }),
});

export const collections = { projects, projectsEn };

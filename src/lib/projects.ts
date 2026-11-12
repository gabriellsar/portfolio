import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export type ProjectLite = {
  code: string;
  title: string;
  desc: string;
  topics: string[];
  base: string;
  href: string;
  caseStudy: boolean;
  anchor: string;
  status?: 'em-andamento';
};

/** Rótulo do selo de status nos cards. */
export const statusLabel = { 'em-andamento': 'em andamento' } as const;

export const anchorOf = (code: string) => code.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function lite(p: Project): ProjectLite {
  const anchor = anchorOf(p.data.code);
  return {
    code: p.data.code,
    title: p.data.title,
    desc: p.data.desc,
    topics: p.data.topics,
    base: p.data.base,
    caseStudy: p.data.caseStudy,
    anchor,
    status: p.data.status,
    href: p.data.caseStudy ? `/projetos/${p.id}` : `/projetos#${anchor}`,
  };
}

/** Destaques da home: `destaque` 1–3 no frontmatter. Sem nenhum marcado, usa os 3 primeiros. */
export function splitFeatured(all: Project[]) {
  let featured = all.filter((p) => p.data.destaque).sort((a, b) => a.data.destaque! - b.data.destaque!).slice(0, 3);
  if (!featured.length) featured = all.slice(0, 3);
  const ids = new Set(featured.map((p) => p.id));
  return { featured, rest: all.filter((p) => !ids.has(p.id)) };
}

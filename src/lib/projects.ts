import { getCollection, type CollectionEntry } from 'astro:content';
import { projectPath, projectsPath, type Lang } from '@/i18n';

export type ProjectData = CollectionEntry<'projects'>['data'];

/** Projeto já no idioma da página. `source` é a entrada que tem o corpo (estudo de caso) para o `render`. */
export type Project = {
  id: string;
  data: ProjectData;
  source: CollectionEntry<'projects'> | CollectionEntry<'projectsEn'>;
};

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

export const anchorOf = (code: string) => code.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export async function getProjects(lang: Lang = 'pt'): Promise<Project[]> {
  const all = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  if (lang === 'pt') return all.map((e) => ({ id: e.id, data: e.data, source: e }));
  const en = new Map((await getCollection('projectsEn')).map((e) => [e.id, e]));
  return all.map((e) => {
    const tr = en.get(e.id);
    if (!tr) return { id: e.id, data: e.data, source: e };
    const { figura, ...text } = tr.data;
    const data: ProjectData = {
      ...e.data,
      ...Object.fromEntries(Object.entries(text).filter(([, v]) => v !== undefined)),
      figura: e.data.figura && { ...e.data.figura, ...Object.fromEntries(Object.entries(figura ?? {}).filter(([, v]) => v !== undefined)) },
    };
    // .md sem corpo (só frontmatter traduzido) continua renderizando o corpo em português, se houver
    const source = tr.body?.trim() ? tr : e;
    return { id: e.id, data, source };
  });
}

/** Link de um projeto: o estudo de caso, ou a âncora do card na lista. */
export const hrefOf = (p: Project, lang: Lang) =>
  p.data.caseStudy ? projectPath(lang, p.id) : `${projectsPath(lang)}#${anchorOf(p.data.code)}`;

export function lite(p: Project, lang: Lang = 'pt'): ProjectLite {
  return {
    code: p.data.code,
    title: p.data.title,
    desc: p.data.desc,
    topics: p.data.topics,
    base: p.data.base,
    caseStudy: p.data.caseStudy,
    anchor: anchorOf(p.data.code),
    status: p.data.status,
    href: hrefOf(p, lang),
  };
}

/** Destaques da home: `destaque` 1–3 no frontmatter. Sem nenhum marcado, usa os 3 primeiros. */
export function splitFeatured(all: Project[]) {
  let featured = all.filter((p) => p.data.destaque).sort((a, b) => a.data.destaque! - b.data.destaque!).slice(0, 3);
  if (!featured.length) featured = all.slice(0, 3);
  const ids = new Set(featured.map((p) => p.id));
  return { featured, rest: all.filter((p) => !ids.has(p.id)) };
}

/** Rotas dos estudos de caso de um idioma, com o anterior e o próximo da lista. */
export async function caseStudyPaths(lang: Lang) {
  const all = await getProjects(lang);
  return all.filter((p) => p.data.caseStudy).map((p) => {
    const i = all.findIndex((x) => x.id === p.id);
    return { params: { slug: p.id }, props: { lang, entry: p, prev: all[i - 1], next: all[i + 1] } };
  });
}

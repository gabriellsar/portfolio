/**
 * Idiomas do site. O português fica na raiz (/, /projetos) e o inglês em /en (/en/, /en/projects).
 * Os textos fixos da interface ficam aqui; o conteúdo (projetos, trajetória) tem a sua versão em inglês
 * em src/content/projects-en e src/data/trajetoria.ts.
 */
export type Lang = 'pt' | 'en';
export const langs: Lang[] = ['pt', 'en'];

export const htmlLang: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };

/** Caminho da home e da lista de projetos em cada idioma. */
export const homePath = (lang: Lang) => (lang === 'en' ? '/en/' : '/');
export const projectsPath = (lang: Lang) => (lang === 'en' ? '/en/projects' : '/projetos');
export const projectPath = (lang: Lang, slug: string) => `${projectsPath(lang)}/${slug}`;
/** Link para uma seção da home (#projetos etc.) a partir de outra página. */
export const homeHash = (lang: Lang, id: string) => (id === 'topo' ? homePath(lang) : `${homePath(lang)}#${id}`);

export const langOf = (pathname: string): Lang => (/^\/en(\/|$)/.test(pathname) ? 'en' : 'pt');

/** A mesma página no outro idioma. Caminho desconhecido (404) cai na home do outro idioma. */
export function altPath(pathname: string): string {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (langOf(p) === 'en') {
    const rest = p.replace(/^\/en/, '') || '/';
    if (rest === '/') return '/';
    const m = rest.match(/^\/projects(\/.*)?$/);
    return m ? `/projetos${m[1] ?? ''}` : '/';
  }
  if (p === '/') return '/en/';
  const m = p.match(/^\/projetos(\/.*)?$/);
  return m ? `/en/projects${m[1] ?? ''}` : '/en/';
}

/** Os dois endereços da página, para o hreflang. */
export function alternates(pathname: string): Record<Lang, string> {
  const here = langOf(pathname);
  const other = altPath(pathname);
  return here === 'pt' ? { pt: pathname, en: other } : { pt: other, en: pathname };
}

export const ui = {
  pt: {
    // barra e navegação
    navLabel: 'Principal',
    tabs: { topo: '0:home', projetos: '1:projetos', trajetoria: '2:trajetória', contato: '3:contato' },
    cv: 'Currículo',
    cvAria: 'Baixar currículo (PDF)',
    langLabel: 'Idioma',
    langSwitch: 'Read in English',
    // capa
    aboutCmd: 'cat sobre.txt',
    contactCmd: 'contato --abrir',
    cvBtn: 'Currículo ↓',
    hint: ['# psst… Aperte ', ' ou ', ' e digite '],
    openShell: 'Abrir o terminal',
    scrollTo: 'Rolar até os projetos',
    scrollLabel: '0x01 · Projetos',
    // projetos
    featured: 'Projetos em destaque',
    topOf: (a: string, b: string) => `TOP ${a} DE ${b}`,
    tech: 'Tecnologia',
    caseStudy: 'Visão detalhada',
    caseSoon: 'Visão detalhada · em breve',
    others: 'Outros projetos',
    seeAll: (n: string) => `Ver todos os ${n} →`,
    allProjects: 'Todos os projetos',
    backHome: '← Voltar para a home',
    total: (n: string) => `TOTAL ${n}`,
    featuredTag: 'destaque',
    code: 'Código ↗',
    app: 'App ↗',
    openApp: 'Abrir o app ↗',
    status: { 'em-andamento': 'em andamento' },
    projectsTitle: 'Projetos - gabriellsar',
    projectsDesc: 'Todos os projetos de Gabriel: pesquisa em ML, dados, nuvem e produto.',
    // estudo de caso
    caseTitle: (t: string) => `${t} — estudo de caso · gabriellsar`,
    allProjectsBack: '← Todos os projetos',
    sheet: 'FICHA',
    shotPlaceholder: '[CAPTURA DO APP · 1600×900]',
    otherProjects: 'Outros projetos',
    prev: '← Anterior',
    next: 'Próximo',
    // ferramentas
    tools: 'Ferramentas',
    toolsAria: 'Ferramentas principais',
    toolsTable: 'Ferramentas por área',
    areasItems: (a: number, b: number) => `${a} áreas · ${b} itens`,
    dirsTools: ['diretórios', 'ferramentas'],
    palette: 'Paleta do design system gabriellsar',
    // trajetória
    journey: 'Trajetória',
    whatIDid: 'O que fiz',
    details: 'Detalhes +',
    close: 'Fechar −',
    detailsAria: (open: boolean, org: string) => `${open ? 'Fechar' : 'Ver'} detalhes: ${org}`,
    area: 'Área',
    period: 'Período',
    project: 'Projeto',
    // rodapé
    footerNav: 'Rodapé',
    navigation: 'Navegação',
    navProjects: 'Projetos',
    navJourney: 'Trajetória',
    navContact: 'Contato',
    channels: 'Canais',
    downloadPdf: 'Baixar PDF ↓',
    copyright: 'GS/PORTFÓLIO',
    top: '↑ TOPO',
    terrain: 'Faixa de terreno gerada por ruído',
    terrainMob: 'Relevo gerado por ruído que fecha a página',
    // 404
    notFoundTitle: '404 — gabriellsar',
    notFound: ['Essa página não existe. Volte para a home ou abra o terminal com ', ' e digite ', '.'],
    lsProjects: 'ls ./projetos',
  },
  en: {
    navLabel: 'Main',
    tabs: { topo: '0:home', projetos: '1:projects', trajetoria: '2:experience', contato: '3:contact' },
    cv: 'Resume',
    cvAria: 'Download resume (PDF)',
    langLabel: 'Language',
    langSwitch: 'Ler em português',
    aboutCmd: 'cat about.txt',
    contactCmd: 'contact --open',
    cvBtn: 'Resume ↓',
    hint: ['# psst… Press ', ' or ', ' and type '],
    openShell: 'Open the terminal',
    scrollTo: 'Scroll to the projects',
    scrollLabel: '0x01 · Projects',
    featured: 'Featured projects',
    topOf: (a: string, b: string) => `TOP ${a} OF ${b}`,
    tech: 'Stack',
    caseStudy: 'Case study',
    caseSoon: 'Case study · coming soon',
    others: 'Other projects',
    seeAll: (n: string) => `See all ${n} →`,
    allProjects: 'All projects',
    backHome: '← Back to home',
    total: (n: string) => `TOTAL ${n}`,
    featuredTag: 'featured',
    code: 'Code ↗',
    app: 'App ↗',
    openApp: 'Open the app ↗',
    status: { 'em-andamento': 'in progress' },
    projectsTitle: 'Projects - gabriellsar',
    projectsDesc: "All of Gabriel's projects: ML research, data, cloud and product.",
    caseTitle: (t: string) => `${t} — case study · gabriellsar`,
    allProjectsBack: '← All projects',
    sheet: 'FACT SHEET',
    shotPlaceholder: '[APP SCREENSHOT · 1600×900]',
    otherProjects: 'Other projects',
    prev: '← Previous',
    next: 'Next',
    tools: 'Tools',
    toolsAria: 'Main tools',
    toolsTable: 'Tools by area',
    areasItems: (a: number, b: number) => `${a} areas · ${b} items`,
    dirsTools: ['directories', 'tools'],
    palette: 'gabriellsar design system palette',
    journey: 'Experience',
    whatIDid: 'What I did',
    details: 'Details +',
    close: 'Close −',
    detailsAria: (open: boolean, org: string) => `${open ? 'Close' : 'View'} details: ${org}`,
    area: 'Sector',
    period: 'Period',
    project: 'Project',
    footerNav: 'Footer',
    navigation: 'Navigation',
    navProjects: 'Projects',
    navJourney: 'Experience',
    navContact: 'Contact',
    channels: 'Channels',
    downloadPdf: 'Download PDF ↓',
    copyright: 'GS/PORTFOLIO',
    top: '↑ TOP',
    terrain: 'Strip of noise-generated terrain',
    terrainMob: 'Noise-generated terrain closing the page',
    notFoundTitle: '404 — gabriellsar',
    notFound: ["This page doesn't exist. Go back home or open the terminal with ", ' and type ', '.'],
    lsProjects: 'ls ./projects',
  },
} satisfies Record<Lang, unknown>;

export type UI = (typeof ui)['pt'];
export const t = (lang: Lang): UI => ui[lang] as UI;

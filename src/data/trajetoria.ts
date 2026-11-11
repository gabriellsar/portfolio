export type Etapa = {
  id: string;
  code: string;
  org: string;
  role: string;
  area: string;
  periodo: string;
  resumo: string;
  feitos: string[];
  tags: string[];
  projeto?: { label: string; href: string };
};

/** Linha do tempo da seção 0x02. A etapa com `open` começa aberta. */
export const trajetoria: Etapa[] = [
  {
    id: 'puc',
    code: 'T/01',
    org: 'PUC-Rio',
    role: 'Engenharia de Computação',
    area: 'Formação',
    periodo: '[ANO] – 2027.2',
    resumo: 'Base em sistemas e computação. O TCC fecha o ciclo: alocação preditiva de recursos em nuvem com redes neurais.',
    feitos: ['TCC: previsão de carga com GRU para guiar a alocação (PF I → PF II)', '[DISCIPLINA OU PROJETO MARCANTE]', '[DISCIPLINA OU PROJETO MARCANTE]'],
    tags: ['sistemas', 'ML', 'dados'],
    projeto: { label: 'P/01 · Alocação preditiva', href: '/projetos' },
  },
  {
    id: 'frog',
    code: 'T/02',
    org: 'FROG · PUC-Rio',
    role: 'Pesquisa',
    area: 'Pesquisa',
    periodo: '[PERÍODO]',
    resumo: 'Laboratório de pesquisa. Construí o WindAnalyzer, app de modelagem não paramétrica de dados de vento, e o artigo que acompanha a ferramenta.',
    feitos: ['App Shiny com K-means, KDE e Monte Carlo', 'Correção de viés da reanálise MERRA-2 com estações do INMET', 'Artigo submetido ao Depto. de Eng. Industrial'],
    tags: ['R', 'Shiny', 'estatística'],
    projeto: { label: 'P/02 · WindAnalyzer', href: '/projetos/windanalyzer' },
  },
  {
    id: 'mjv',
    code: 'T/03',
    org: 'MJV Technology & Innovation',
    role: 'Consultoria',
    area: 'Mercado',
    periodo: '[PERÍODO]',
    resumo: '[Contexto: tipo de cliente e problema que você atacou.]',
    feitos: ['[ENTREGA 1]', '[ENTREGA 2]', '[ENTREGA 3]'],
    tags: ['consultoria', '[FERRAMENTA]'],
  },
  {
    id: 'inst',
    code: 'T/04',
    org: 'Instrumento.io',
    role: 'Desenvolvimento em startup',
    area: 'Mercado',
    periodo: '[PERÍODO]',
    resumo: '[Contexto: o produto e o seu papel no time.]',
    feitos: ['[ENTREGA 1]', '[ENTREGA 2]', '[ENTREGA 3]'],
    tags: ['startup', '[STACK]'],
  },
  {
    id: 'mon',
    code: 'T/05',
    org: 'PUC-Rio',
    role: 'Monitoria · Introdução à Ciência de Dados',
    area: 'Ensino',
    periodo: '[PERÍODO]',
    resumo: 'Apoio aos alunos da disciplina de Introdução à Ciência de Dados.',
    feitos: ['[ATIVIDADE 1]', '[ATIVIDADE 2]'],
    tags: ['ensino', 'ciência de dados'],
  },
];

export const trajetoriaAberta = 'frog';

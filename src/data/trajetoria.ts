export type Sub = {
  id: string;
  role: string;
  periodo: string;
  feitos: string[];
  tags: string[];
};

export type Etapa = {
  id: string;
  code: string;
  org: string;
  role: string;
  area_in: string;
  area_out: string;
  periodo: string;
  resumo: string;
  feitos?: string[]; // opcional: etapas com subs podem não ter
  tags?: string[];
  projeto?: { label: string; href: string };
  subs?: Sub[]; // subtópicos, cada um numa caixa própria
};

export const trajetoria: Etapa[] = [
  {
    id: 'mjv',
    code: 'T/01',
    org: 'MJV Technology & Innovation',
    role: 'Estagiário de Inovação',
    area_in: 'Seguros',
    area_out: 'Mercado',
    periodo: 'jan/2026 – presente',
    resumo: 'Consultoria em inovação: estruturação de modelos de processos de negócio a partir de dados operacionais.',
    feitos: [
      'Mapeamento de fluxos e análise de dados operacionais para identificar gargalos',
      'Definição de indicadores de eficiência',
      'Documentação de processos e análises quantitativas para embasar decisões entre áreas e stakeholders',
    ],
    tags: ['consultoria', 'análise de dados', 'processos'],
  },
  {
    id: 'frog',
    code: 'T/02',
    org: 'FROG · PUC-Rio',
    role: 'Pesquisador de Iniciação Científica',
    area_in: 'Energia Renovável',
    area_out: 'Pesquisa',
    periodo: 'mar/2025 – mar/2026',
    resumo: 'Iniciação científica no Depto. de Eng. Industrial. Construí o WindAnalyzer, ferramenta de apoio à decisão que troca a curva de potência do fabricante por uma projeção probabilística aprendida com os dados do parque eólico.',
    feitos: [
      'Pipeline de séries temporais: reanálise MERRA-2 cruzada com estações do INMET, filtragem de leituras inconsistentes e correção de viés',
      'Modelagem não paramétrica com K-means, KDE e Monte Carlo, com bandas de confiança de 90%',
      'Software registrado no INPI (BR512026006513-5)',
      'Artigo técnico de IC sobre a arquitetura e a metodologia da ferramenta (DEI/PUC-Rio)',
    ],
    tags: ['R · Shiny', 'estatística', 'séries temporais'],
    projeto: { label: 'P/03 · WindAnalyzer', href: '/projetos/windanalyzer' },
  },
  {
    id: 'inst',
    code: 'T/03',
    org: 'Instrumento.io',
    role: 'Analista de Sistemas',
    area_in: 'Educação',
    area_out: 'Mercado',
    periodo: 'out/2024 – set/2025',
    resumo: 'Manutenção e evolução da plataforma da startup, construída em Bubble (low-code), de ponta a ponta no ciclo de desenvolvimento.',
    feitos: [
      'Implementação de funcionalidades e correção de bugs',
      'Testes e homologação das entregas',
      'Integração com serviços e bases de dados externas',
    ],
    tags: ['startup', 'bubble', 'low-code'],
  },
  {
    id: 'mon',
    code: 'T/04',
    org: 'PUC-Rio',
    role: 'Monitoria',
    area_in: 'Educação',
    area_out: 'Ensino',
    periodo: 'mar/2023 – dez/2024',
    resumo: 'Duas monitorias na graduação, uma em dados e outra em gestão de projetos de engenharia.',
    subs: [
      {
        id: 'mon-icd',
        role: 'Introdução à Ciência de Dados',
        periodo: 'ago/2024 – dez/2024',
        feitos: [
          'Apoio aos alunos em coleta, limpeza e pré-processamento de dados',
          'Implementação de modelos supervisionados e não supervisionados',
          'Avaliação de modelos com Python (pandas, scikit-learn)',
        ],
        tags: ['ciência de dados', 'pandas', 'scikit-learn'],
      },
      {
        id: 'mon-pi',
        role: 'Projeto Integrado',
        periodo: 'mar/2023 – ago/2024',
        feitos: [
          'Disciplina prática sobre metodologias e ferramentas para projetos de engenharia',
          'Apoio às equipes na aplicação de práticas ágeis, com foco em Scrum',
        ],
        tags: ['scrum', 'ágil', 'gestão de projetos'],
      },
    ],
  },
];

export const trajetoriaAberta = 'mjv';

export const trajetoriaEn: Etapa[] = [
  {
    id: 'mjv',
    code: 'T/01',
    org: 'MJV Technology & Innovation',
    role: 'Innovation Intern',
    area_in: 'Insurance',
    area_out: 'Industry',
    periodo: 'Jan 2026 – present',
    resumo: 'Innovation consulting: structuring business process models from operational data.',
    feitos: [
      'Mapping workflows and analyzing operational data to find bottlenecks',
      'Defining efficiency metrics',
      'Documenting processes and running quantitative analyses to support decisions across teams and stakeholders',
    ],
    tags: ['consulting', 'data analysis', 'processes'],
  },
  {
    id: 'frog',
    code: 'T/02',
    org: 'FROG · PUC-Rio',
    role: 'Undergraduate Researcher',
    area_in: 'Renewable Energy',
    area_out: 'Research',
    periodo: 'Mar 2025 – Mar 2026',
    resumo: "Undergraduate research in the Industrial Engineering Department. I built WindAnalyzer, a decision-support tool that replaces the manufacturer's power curve with a probabilistic projection learned from the wind farm's own data.",
    feitos: [
      'Time-series pipeline: MERRA-2 reanalysis cross-referenced with INMET weather stations, filtering of inconsistent readings and bias correction',
      'Non-parametric modeling with K-means, KDE and Monte Carlo, with 90% confidence bands',
      'Software registered with INPI, the Brazilian IP office (BR512026006513-5)',
      "Undergraduate research technical paper on the tool's architecture and methodology (DEI/PUC-Rio)",
    ],
    tags: ['R · Shiny', 'statistics', 'time series'],
    projeto: { label: 'P/03 · WindAnalyzer', href: '/en/projects/windanalyzer' },
  },
  {
    id: 'inst',
    code: 'T/03',
    org: 'Instrumento.io',
    role: 'Systems Analyst',
    area_in: 'Education',
    area_out: 'Industry',
    periodo: 'Oct 2024 – Sep 2025',
    resumo: "Maintaining and evolving the startup's platform, built on Bubble (low-code), across the whole development cycle.",
    feitos: [
      'Building features and fixing bugs',
      'Testing and signing off on releases',
      'Integrating with external services and databases',
    ],
    tags: ['startup', 'bubble', 'low-code'],
  },
  {
    id: 'mon',
    code: 'T/04',
    org: 'PUC-Rio',
    role: 'Teaching Assistant',
    area_in: 'Education',
    area_out: 'Teaching',
    periodo: 'Mar 2023 – Dec 2024',
    resumo: 'Two teaching assistantships during my degree, one in data and one in engineering project management.',
    subs: [
      {
        id: 'mon-icd',
        role: 'Introduction to Data Science',
        periodo: 'Aug 2024 – Dec 2024',
        feitos: [
          'Supporting students with data collection, cleaning and preprocessing',
          'Implementing supervised and unsupervised models',
          'Evaluating models with Python (pandas, scikit-learn)',
        ],
        tags: ['data science', 'pandas', 'scikit-learn'],
      },
      {
        id: 'mon-pi',
        role: 'Integrated Project',
        periodo: 'Mar 2023 – Aug 2024',
        feitos: [
          'Hands-on course on methods and tools for engineering projects',
          'Helping teams apply agile practices, with a focus on Scrum',
        ],
        tags: ['scrum', 'agile', 'project management'],
      },
    ],
  },
];

export const trajetoriaFor = (lang: 'pt' | 'en') => (lang === 'en' ? trajetoriaEn : trajetoria);

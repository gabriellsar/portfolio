export const stack: { dir: string; items: string[] }[] = [
  { dir: 'linguagens', items: ['python', 'sql', 'typescript'] },
  { dir: 'machine-learning', items: ['pytorch', 'scikit-learn', 'statsmodels'] },
  { dir: 'genAi', items: ['bedrock', 'whisper', 'rag'] },
  { dir: 'dados', items: ['pandas', 'duckdb', 'spark', 'iceberg', 'postgresql'] },
  { dir: 'cloud/aws', items: ['s3', 'glue', 'athena', 'lambda', 'step-functions'] },
  { dir: 'devOps', items: ['docker', 'sam', 'kubernetes'] },
];

export const sistema = 'arch · hyprland';

/** Nomes de diretório em inglês (os itens são nomes de ferramenta e não mudam). */
const dirEn: Record<string, string> = { linguagens: 'languages', dados: 'data' };
export const stackEn = stack.map((d) => ({ ...d, dir: dirEn[d.dir] ?? d.dir }));
export const stackFor = (lang: 'pt' | 'en') => (lang === 'en' ? stackEn : stack);

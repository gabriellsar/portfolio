/**
 * Dados gerais do site. Preencha os campos entre colchetes antes de publicar.
 */
export const site = {
  name: 'gabriel.s',
  author: 'Gabriel',
  title: 'gabriel.s — portfólio',
  description:
    'Engenharia de Computação na PUC-Rio. Pesquisa em ML aplicado, gráficos procedurais e software que vira produto.',
  location: 'RIO · UTC−3',
  status: 'ABERTO A ESTÁGIO',
  rev: 'REV 0.1',
  email: '[EMAIL]',
  github: 'https://github.com/gabriellsar',
  githubLabel: 'github.com/gabriellsar',
  linkedin: '[LINKEDIN]',
  cv: '/cv.pdf',
  // Tela de boot na primeira visita da sessão. Desligada por padrão.
  boot: false,
};

export const mailto = site.email.startsWith('[') ? '#contato' : `mailto:${site.email}`;
export const linkedinHref = site.linkedin.startsWith('[') ? '#contato' : site.linkedin;

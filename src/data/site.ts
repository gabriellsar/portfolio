export const site = {
  name: 'gabriel.r',
  author: 'Gabriel',
  title: 'Gabriel Rosas',
  description:
    'Engenharia de Computação na PUC-Rio. Pesquisa em ML aplicado, gráficos procedurais e software que vira produto.',
  location: 'RIO DE JANEIRO, BRASIL',
  email: 'gabrielsrosas@gmail.com',
  github: 'https://github.com/gabriellsar',
  githubLabel: 'github.com/gabriellsar',
  linkedin: 'https://www.linkedin.com/in/gabriellsar/',
  cv: '/cv.pdf',
  boot: true,
};

export const mailto = site.email.startsWith('[') ? '#contato' : `mailto:${site.email}`;
export const linkedinHref = site.linkedin.startsWith('[') ? '#contato' : site.linkedin;
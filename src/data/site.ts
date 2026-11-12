export const site = {
  name: 'gabriellsar',
  author: 'Gabriel',
  title: 'Gabriel Rosas',
  description:
    'Engenharia de Computação na PUC-Rio. Pesquiso ML aplicado a dados e nuvem e gosto de levar o modelo do notebook até a produção.',
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
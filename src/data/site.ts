export const site = {
  name: 'gabriellsar',
  author: 'Gabriel',
  title: 'Gabriel Rosas',
  description:
    'Estudante de Engenharia de Computação na PUC-Rio. Pesquiso e construo soluções de machine learning aplicado e levo modelos do notebook até a produção.',
  location: 'RIO DE JANEIRO, BRASIL',
  email: 'gabrielsrosas@gmail.com',
  github: 'https://github.com/gabriellsar',
  githubLabel: 'github.com/gabriellsar',
  linkedin: 'https://www.linkedin.com/in/gabriellsar/',
  linkedinLabel: 'linkedin.com/in/gabriellsar',
  cv: '/cv.pdf',
  boot: false,
};

export const mailto = site.email.startsWith('[') ? '#contato' : `mailto:${site.email}`;
export const linkedinHref = site.linkedin.startsWith('[') ? '#contato' : site.linkedin;
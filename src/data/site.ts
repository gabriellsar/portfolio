import type { Lang } from '@/i18n';

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

/** Textos do `site` que mudam com o idioma. */
export const siteText: Record<Lang, { description: string; location: string; cv: string }> = {
  pt: { description: site.description, location: site.location, cv: site.cv },
  en: {
    description:
      'Computer Engineering student at PUC-Rio. I research and build applied machine learning solutions and take models from the notebook to production.',
    location: 'RIO DE JANEIRO, BRAZIL',
    // Trocar para '/cv-en.pdf' quando houver currículo em inglês em public/
    cv: site.cv,
  },
};

export const mailto = site.email.startsWith('[') ? '#contato' : `mailto:${site.email}`;
export const linkedinHref = site.linkedin.startsWith('[') ? '#contato' : site.linkedin;

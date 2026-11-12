# gabriellsar — portfólio

Portfólio pessoal construído com o design system **gabriellsar**: dark-first, estética de terminal, um acento frio por tela.

- **Astro 5** gera o site estático; **React** só onde há interação (barra tmux, shell, linha do tempo, boot).
- **Tailwind 4** está disponível e lê os tokens (`bg-surface`, `text-muted`, `border-line`…), mas a maior parte do visual vem das classes `gs-*` do design system.
- Fontes: Geist e Geist Mono, servidas localmente via Fontsource.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
npm run preview  # serve o build
```

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Nome, e-mail, LinkedIn, status, tela de boot | `src/data/site.ts` |
| Linha do tempo (Trajetória) | `src/data/trajetoria.ts` |
| Ferramentas (`ls -l ~/stack`) | `src/data/stack.ts` |
| Projetos | `src/content/projects/*.md` / `*.mdx` |
| Cores, tipografia, espaçamento | `src/styles/tokens.css` |
| Componentes do DS | `src/components/ui/index.tsx` + `src/styles/components.css` |
| Estilos do portfólio | `src/styles/global.css` |
| Comandos do shell | `src/components/home/Shell.tsx` (`exec`) |

### Adicionar um projeto

Crie `src/content/projects/meu-projeto.md`:

```md
---
code: P/09
title: Meu projeto
desc: Uma frase sobre o que ele faz.
topics: [tópico, tópico, tópico]
base: Rust · wgpu
order: 9
repo: https://github.com/gabriellsar/meu-projeto   # opcional
---
```

### Escolher os 3 destaques da home

Coloque `destaque: 1`, `destaque: 2` ou `destaque: 3` no frontmatter do projeto. O número define a ordem dos cards. Os outros projetos aparecem na lista "Outros projetos" e em `/projetos`.

### Visão ampliada (estudo de caso)

Use `.mdx` e `caseStudy: true`. A página `/projetos/<nome-do-arquivo>` é gerada com o cabeçalho (`eyebrow`, `lead`, `tags`, `ficha`, `figura`) e o corpo do MDX. `windanalyzer.mdx` serve de modelo, com os componentes `Section`, `Tabs`, `TabPanel`, `Learned`, `Card` e `Stat`.

Para trocar o placeholder da figura por uma captura real, coloque a imagem em `public/` e preencha `figura.src`:

```yaml
figura:
  src: /windanalyzer.png
  alt: Interface do WindAnalyzer
  legenda: FIG.02 — INTERFACE DO WINDANALYZER
```

## Antes de publicar: placeholders

Busque por `[` no projeto para achar todos. Os principais:

- `src/data/site.ts`: `[EMAIL]`, `[LINKEDIN]`. Enquanto estiverem entre colchetes, os botões levam para `#contato`.
- `public/cv.pdf`: o botão "Baixar CV" aponta para esse arquivo.
- `src/data/trajetoria.ts`: `[PERÍODO]`, `[ANO]`, entregas da MJV e da Instrumento.io, atividades da monitoria.
- `src/data/stack.ts`: os serviços AWS (`[SERVIÇO]`).
- `src/content/projects/`: `[LINGUAGEM]` no P/01, `[STACK]` do P/06 ao P/08.
- `src/content/projects/windanalyzer.mdx`: resultados (`[—%]`, `[N]`), aprendizados e período.
- `astro.config.mjs`: `site` com a URL final (usada em links canônicos).

## Detalhes

- **Tema**: começa escuro. O botão da barra (ou `tema claro` no shell) troca e lembra a escolha.
- **Shell**: abra com `:`, `Ctrl+K` ou o botão `:cmd`. `help` lista os comandos; `sudo play snake` e `sudo play blocos` são jogos.
- **Rodapé**: o relevo é gerado no build, com a semente no dia do ano. Cada deploy em um dia diferente desenha outro terreno.
- **Boot**: desligado. Para ligar, `boot: true` em `src/data/site.ts`. Aparece uma vez por sessão e é pulado com `prefers-reduced-motion`.

## Deploy

O build é estático (`dist/`), então qualquer host serve:

- **Vercel** ou **Netlify**: importe o repositório. O framework Astro é detectado sozinho.
- **Cloudflare Pages**: comando `npm run build`, pasta `dist`.
- **GitHub Pages**: use a action oficial `withastro/action` e ajuste `site` (e `base`, se for em `/portfolio`).

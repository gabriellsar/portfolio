// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * O Astro só gera 404.html na raiz; as outras rotas viram pasta/index.html.
 * A Cloudflare serve o 404.html mais próximo do caminho pedido, então /en/404/index.html vira /en/404.html.
 */
const nested404 = {
  name: 'nested-404',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const out = fileURLToPath(dir);
      const from = `${out}en/404/index.html`;
      if (!existsSync(from)) return;
      renameSync(from, `${out}en/404.html`);
      rmSync(`${out}en/404`, { recursive: true, force: true });
    },
  },
};

export default defineConfig({
  site: 'https://gabriellsar.dev/',
  integrations: [react(), mdx(), nested404],
  vite: {
    plugins: [tailwindcss()],
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Troque pelo domínio final antes de publicar (usado em links canônicos e Open Graph).
  site: 'https://example.com',
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});

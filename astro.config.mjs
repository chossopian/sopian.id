// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sopian.id',
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: node({
    mode: 'standalone'
  }),

  integrations: [sitemap()]
});
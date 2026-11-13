import { defineConfig } from 'vite';

// Served from https://bladejhs.github.io/beast-english/
export default defineConfig({
  base: '/beast-english/',
  build: { target: 'es2022', assetsInlineLimit: 0 },
  define: { __BUILD__: JSON.stringify(process.env['GITHUB_SHA']?.slice(0, 7) ?? 'local') },
});

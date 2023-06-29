import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr(), mdx(), visualizer()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.NODE_PORT}`,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  preview: {
    port: 5000,
  },
  define: {
    LOGFLARE_API_KEY: JSON.stringify(process.env.LOGFLARE_API_KEY),
    LOGFLARE_SOURCE_TOKEN: JSON.stringify(
      mode === 'development'
        ? process.env.LOGFLARE_CLIENT_DEV_ID
        : process.env.LOGFLARE_CLIENT_PROD_ID,
    ),
  },
}));

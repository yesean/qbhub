import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  plugins: [react(), svgr(), mdx(), visualizer()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.NODE_PORT}`,
      },
    },
  },
  preview: {
    port: 5000,
  },
  envDir: '../..',
}));

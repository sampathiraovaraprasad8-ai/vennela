import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures GitHub Pages relative assets loading
  build: {
    outDir: 'dist',
  }
});

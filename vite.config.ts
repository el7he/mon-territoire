// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'; // ← 'vitest/config', pas 'vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
});
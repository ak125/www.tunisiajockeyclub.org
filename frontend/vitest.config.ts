/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.ts',
        'build/',
        'public/',
      ],
    },
    // Configuration pour les tests parallèles
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    // Timeout pour les tests lents
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app'),
    },
  },
  // Configuration pour les tests de performance
  define: {
    'import.meta.vitest': 'undefined',
  },
})

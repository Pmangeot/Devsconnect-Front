/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // on va gérer le DOM en js
    environment: 'jsdom',
    // le fichier de _setup_ qui sera exécuté avant de lancer les tests
    // fournira plus d'options à notre _expect_,
    // voire simulera un serveur pour nos requêtes HTTP…
    setupFiles: './src/__tests__/setup.ts',
    // on définit que le coverage doit se faire sur tous les fichiers, même les non testés
    // on définit que le coverage doit se faire sur tous les fichiers, même les non testés
    coverage: {
      all: true,
    },
  },
});

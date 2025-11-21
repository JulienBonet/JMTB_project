// import { defineConfig } from 'vite'; 
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   root: './frontend',
//   build: {
//     outDir: './build',
//     emptyOutDir: true,
//     rollupOptions: {
//       input: './frontend/index.html',
//     },
//   },
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3310',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// --------------------------------------
// CONFIG RECOMMANDÉE POUR UN MONOLITHE
// --------------------------------------

export default defineConfig({
  plugins: [react()],
  root: './frontend',               // le dossier frontend
  build: {
    outDir: 'dist',                 // dossier build → /frontend/dist
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',          // IMPORTANT : relatif à root
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3310',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});

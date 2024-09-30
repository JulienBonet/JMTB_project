import { defineConfig } from 'vite'; 
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './frontend', // chemin vers votre frontend
  build: {
    outDir: './build', // Le build sera généré dans frontend/build
    emptyOutDir: true, // Vide le dossier de build avant chaque build
    rollupOptions: {
      input: './frontend/index.html', // Assurez-vous que ce chemin est correct
    },
  },
});


import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Explicitly import process to resolve 'cwd' property on the Process type in Node environment
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis do ficheiro .env ou do ambiente do sistema (Vercel)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Isto garante que o código fonte consegue ler process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    server: {
      port: 3000
    }
  };
});
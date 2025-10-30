import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
//import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  server:{
  port:8080,
  host: "::"
},
  plugins: [react()],

}));

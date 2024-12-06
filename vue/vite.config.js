import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';

import { createCert } from "mkcert";

const privateKey = fs.readFileSync('../certs/privkey.pem', 'utf8');
const certificate = fs.readFileSync('../certs/cert.pem', 'utf8');

const options = {
  key: privateKey,
  cert: certificate
};
export default defineConfig({
  server: { port: 443,
    https: options,
  },
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

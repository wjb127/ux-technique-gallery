import { defineConfig } from 'vite';
import fs from 'node:fs';
const input = { index: 'index.html' };
if (fs.existsSync('t')) for (const s of fs.readdirSync('t')) input[s] = `t/${s}/index.html`;
export default defineConfig({ build: { target: 'es2022', rollupOptions: { input }, chunkSizeWarningLimit: 800 }, server: { port: 5173 }, preview: { port: 4173 } });

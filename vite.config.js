import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('swiper-')
        }
      }
    }),
    nodePolyfills({
      include: ['buffer', 'process']
    }),
    createHtmlPlugin({
      inject: {
        data: {
          version: Date.now(), // Уникальный параметр версии для предотвращения кеширования
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'process.env': {},
    'global': 'window'
  },
  optimizeDeps: {
    include: ['buffer']
  }
});

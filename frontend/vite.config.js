import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "http://127.0.0.1:8000/",
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    include: /\.[jt]sx?$/,
  },
  build: {
    outDir: '../backend/frontend/dist', // Изменяем стандартный путь на ./distr
  },
  // server: {
  //   proxy: {
  //     '^(?!(.*\.html)|(.js))$': {
  //       target: 'http://127.0.0.1:8000',
  //       changeOrigin: true,
  //       secure: false,
  //       ws: true, // Поддержка WebSocket, если необходимо
  //       rewrite: path => path
  //     }
  //   }
  // }
})

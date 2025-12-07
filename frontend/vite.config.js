import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://github.com/BudTon/diplom_cloud_frontend",
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    include: /\.[jt]sx?$/,
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://95.163.232.154/', // замените на нужный URL
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})

import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import path from "path"
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'


export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
            buffer: true
        })
      ]
    }
  },
  plugins: [
    solid(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@backend-types": path.resolve(__dirname, "../backend/src/types")
    }
  }
})

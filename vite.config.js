import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs-extra'

// Custom plugin to copy extension files
const copyExtensionFiles = () => {
  return {
    name: 'copy-extension-files',
    closeBundle: async () => {
      // Copy manifest
      await fs.copy('manifest.json', 'dist/manifest.json')
      
      // Copy background and content scripts
      await fs.copy('background.js', 'dist/background.js')
      await fs.copy('content.js', 'dist/content.js')
      
      // Copy icons if they exist
      if (fs.existsSync('icons')) {
        await fs.copy('icons', 'dist/icons')
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), copyExtensionFiles()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
    target: 'esnext',
    minify: false // Disable minification for better debugging
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: false // Disable HMR for extension
  }
}) 
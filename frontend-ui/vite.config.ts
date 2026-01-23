/**
 * @file vite.config.ts
 * @description Configuration for Vite and Vitest.
 * Note: We import defineConfig from 'vitest/config' to get type support for the 'test' property.
 */

// FIX: Importa da 'vitest/config' invece che da 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,            
    environment: 'jsdom',     
    setupFiles: './src/tests/setup.ts', 
    css: true,                
  },
})
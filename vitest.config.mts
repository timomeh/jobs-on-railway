import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    restoreMocks: true,
    setupFiles: ['/config/vitest-setup.ts'],
    globals: true, // automatically does a DOM cleanup after each test
  },
})

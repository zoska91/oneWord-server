import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './tests/vitest.setup.ts',
    transformIgnorePatterns: [
      '/node_modules/web-push/src/web-push-lib\\.js$', // Ignoruje plik web-push-lib.js
    ],
  },
});

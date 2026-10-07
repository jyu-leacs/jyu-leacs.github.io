import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://localhost:8080' },
  webServer: { command: 'npm run preview', url: 'http://localhost:8080', reuseExistingServer: !process.env.CI },
  reporter: 'list'
});

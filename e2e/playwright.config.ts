import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const baseURL = process.env.BASE_URL ?? 'http://localhost:5173';
const apiBaseUrl = process.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: __dirname,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
  },
  expect: {
    timeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `npm --prefix "${projectRoot}" exec tsp compile "${projectRoot}/main.tsp" && "${projectRoot}/backend/mvnw" -f "${projectRoot}/backend/pom.xml" spring-boot:run -Dspring-boot.run.profiles=e2e`,
      url: `${apiBaseUrl}/admin/event-types`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: `npm --prefix "${projectRoot}/frontend" run dev`,
      url: baseURL,
      reuseExistingServer: true,
      timeout: 60_000,
      env: {
        VITE_API_BASE_URL: apiBaseUrl,
      },
    },
  ],
});

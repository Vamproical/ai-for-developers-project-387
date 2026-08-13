import { test as base, expect } from '@playwright/test';
import { cleanupDb } from './api-seed';

type ResetDatabaseFixtures = {
  resetDatabase: void;
};

export const test = base.extend<ResetDatabaseFixtures>({
  resetDatabase: [async ({}, use) => {
    await cleanupDb();
    await use();
  }, { auto: true }],
});

export { expect };

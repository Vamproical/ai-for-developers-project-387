import type { Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract goto(): Promise<void>;

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async gotoAndWaitForLoad(): Promise<void> {
    await this.goto();
    await this.waitForLoad();
  }
}

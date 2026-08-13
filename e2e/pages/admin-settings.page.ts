import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminSettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/settings');
  }

  async navigate(): Promise<void> {
    await this.gotoAndWaitForLoad();
  }

  async setName(name: string): Promise<void> {
    await this.page.getByLabel('Display name').fill(name);
  }

  async setTimezone(timezone: string): Promise<void> {
    const timezoneSelect = this.page.getByRole('combobox', { name: 'Timezone' });
    await timezoneSelect.click();
    await timezoneSelect.fill(timezone);
    await this.page.getByRole('option', { name: timezone, exact: true }).click();
  }

  async save(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.getByText('Settings saved', { exact: true }).waitFor({ state: 'visible' });
  }

  async openSchedules(): Promise<void> {
    await this.page.getByRole('navigation').getByText('Schedules', { exact: true }).click();
    await this.waitForLoad();
  }
}

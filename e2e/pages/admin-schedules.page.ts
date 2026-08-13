import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminSchedulesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/schedules');
  }

  async navigate(): Promise<void> {
    await this.gotoAndWaitForLoad();
  }

  async createSchedule(
    daysOfWeek: string[],
    startTime: string,
    endTime: string,
    startDate: string,
    endDate: string,
    slotDuration?: number,
  ): Promise<void> {
    await this.page.getByRole('button', { name: 'Create Schedule' }).click();

    const modal = this.page.getByRole('dialog');
    await modal.waitFor({ state: 'visible' });

    for (const day of daysOfWeek) {
      await modal.getByLabel(day).check();
    }

    await modal.getByLabel('Start time').fill(startTime);
    await modal.getByLabel('End time').fill(endTime);
    await modal.getByLabel('Start date').fill(startDate);
    await modal.getByLabel('End date').fill(endDate);

    if (slotDuration !== undefined) {
      await modal.getByLabel('Slot duration (minutes, optional)').fill(String(slotDuration));
    }

    const responsePromise = this.page.waitForResponse((response) =>
      response.request().method() === 'POST'
      && response.url().endsWith('/admin/schedules'),
    );
    await modal.getByRole('button', { name: 'Create', exact: true }).click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`Schedule creation failed: ${response.status()} ${await response.text()}`);
    }

    await modal.waitFor({ state: 'hidden' });
    await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
  }

  async getSchedules(): Promise<Array<{ days: string; time: string; dateRange: string; slotDuration: string }>> {
    const rows = await this.page.locator('tbody tr').all();

    const result: Array<{ days: string; time: string; dateRange: string; slotDuration: string }> = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 4) {
        result.push({
          days: await cells[0].textContent() || '',
          time: await cells[1].textContent() || '',
          dateRange: await cells[2].textContent() || '',
          slotDuration: await cells[3].textContent() || '',
        });
      }
    }

    return result;
  }
}

import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminEventTypesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/event-types');
  }

  async navigate(): Promise<void> {
    await this.gotoAndWaitForLoad();
  }

  async createEventType(
    name: string,
    description: string,
    duration: number,
  ): Promise<void> {
    await this.page.getByRole('button', { name: 'Create Event Type' }).click();

    const modal = this.page.getByRole('dialog');
    await modal.waitFor({ state: 'visible' });

    await modal.getByLabel('Name').fill(name);
    await modal.getByLabel('Description').fill(description);
    await modal.getByLabel('Duration (minutes)').fill(String(duration));

    const responsePromise = this.page.waitForResponse((response) =>
      response.request().method() === 'POST'
      && response.url().endsWith('/admin/event-types'),
    );
    await modal.getByRole('button', { name: 'Create', exact: true }).click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`Event type creation failed: ${response.status()} ${await response.text()}`);
    }

    await modal.waitFor({ state: 'hidden' });
    await this.page.getByRole('cell', { name, exact: true }).waitFor({ state: 'visible' });
  }

  async getEventTypes(): Promise<Array<{ name: string; description: string; duration: string }>> {
    const rows = await this.page.locator('table tbody tr').all();

    const result: Array<{ name: string; description: string; duration: string }> = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 3) {
        result.push({
          name: await cells[0].textContent() || '',
          description: await cells[1].textContent() || '',
          duration: await cells[2].textContent() || '',
        });
      }
    }

    return result;
  }

  async editEventType(
    name: string,
    changes: { name?: string; description?: string; durationMinutes?: number },
  ): Promise<void> {
    const row = this.page.locator('table tbody tr', { hasText: name });
    await row.getByRole('button', { name: 'Edit' }).click();

    const modal = this.page.getByRole('dialog');
    await modal.waitFor({ state: 'visible' });

    if (changes.name !== undefined) {
      await modal.getByLabel('Name').fill(changes.name);
    }
    if (changes.description !== undefined) {
      await modal.getByLabel('Description').fill(changes.description);
    }
    if (changes.durationMinutes !== undefined) {
      await modal.getByLabel('Duration (minutes)').fill(String(changes.durationMinutes));
    }

    const responsePromise = this.page.waitForResponse((response) =>
      response.request().method() === 'PUT'
      && /\/admin\/event-types\/[^/]+$/.test(response.url()),
    );
    await modal.getByRole('button', { name: 'Save', exact: true }).click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`Event type update failed: ${response.status()} ${await response.text()}`);
    }

    await modal.waitFor({ state: 'hidden' });
  }

  async deleteEventType(name: string): Promise<void> {
    const row = this.page.locator('table tbody tr', { hasText: name });
    await row.getByRole('button', { name: 'Delete' }).click();

    const modal = this.page.getByRole('dialog');
    await modal.waitFor({ state: 'visible' });

    const responsePromise = this.page.waitForResponse((response) =>
      response.request().method() === 'DELETE'
      && /\/admin\/event-types\/[^/]+$/.test(response.url()),
    );
    await modal.getByRole('button', { name: 'Delete', exact: true }).click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`Event type deletion failed: ${response.status()} ${await response.text()}`);
    }

    await modal.waitFor({ state: 'hidden' });
  }
}

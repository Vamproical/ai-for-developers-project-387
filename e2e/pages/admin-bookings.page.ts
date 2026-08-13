import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';

interface BookingRow {
  guest: string;
  email: string;
  eventType: string;
  status: string;
}

export class AdminBookingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/bookings');
  }

  async navigate(): Promise<void> {
    await this.gotoAndWaitForLoad();
  }

  async getBookings(): Promise<BookingRow[]> {
    await this.page.waitForLoadState('networkidle');

    const rows = await this.page.locator('tbody tr').all();

    const result: BookingRow[] = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 5) {
        result.push({
          guest: await cells[0].textContent() || '',
          email: await cells[1].textContent() || '',
          eventType: await cells[2].textContent() || '',
          status: await cells[4].textContent() || '',
        });
      }
    }

    return result;
  }

  async filterByEventType(eventTypeName: string): Promise<void> {
    const responsePromise = this.page.waitForResponse((response) =>
      response.url().includes('/admin/bookings?eventTypeId=')
      && response.request().method() === 'GET',
    );
    await this.page.getByRole('combobox', { name: 'Event type' }).click();
    await this.page.getByRole('option', { name: eventTypeName }).click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`Event type filter failed: ${response.status()} ${await response.text()}`);
    }
    await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
  }

  async filterByStatus(status: string): Promise<void> {
    const responsePromise = this.page.waitForResponse((response) =>
      response.url().includes('status=confirmed')
      && response.request().method() === 'GET',
    );
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.getByRole('option', { name: status.charAt(0).toUpperCase() + status.slice(1) }).click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`Status filter failed: ${response.status()} ${await response.text()}`);
    }
    await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
  }

  async getFilteredBookings(): Promise<BookingRow[]> {
    return this.getBookings();
  }

  async cancelBooking(guestEmail: string): Promise<void> {
    const row = this.page.locator('tbody tr', { hasText: guestEmail });
    await row.getByRole('button', { name: 'Cancel' }).click();

    const modal = this.page.getByRole('dialog');
    await modal.waitFor({ state: 'visible' });

    const responsePromise = this.page.waitForResponse((response) =>
      response.request().method() === 'PATCH'
      && response.url().endsWith('/cancel'),
    );
    await modal.getByRole('button', { name: 'Yes, cancel' }).click();
    const response = await responsePromise;
    if (!response.ok()) {
      throw new Error(`Booking cancellation failed: ${response.status()} ${await response.text()}`);
    }

    await modal.waitFor({ state: 'hidden' });
  }

  async waitForCancelDisabled(guestEmail: string): Promise<void> {
    const row = this.page.locator('tbody tr', { hasText: guestEmail });
    await expect(row.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  }
}

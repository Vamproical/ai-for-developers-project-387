import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class GuestPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async navigate(): Promise<void> {
    await this.gotoAndWaitForLoad();
  }

  async getAvailableSlots(): Promise<Array<{ id: string; time: string }>> {
    const slots = this.page.locator('button[data-slot-id]');
    await slots.first().waitFor({ state: 'visible' });

    return slots.evaluateAll((buttons) => buttons.map((button) => ({
      id: button.getAttribute('data-slot-id') ?? '',
      time: button.textContent?.trim() ?? '',
    })));
  }

  async selectSlot(slotId: string): Promise<void> {
    await this.page.locator(`button[data-slot-id="${slotId}"]`).click();

    await this.page.getByText('Select Event Type').waitFor({ state: 'visible' });
  }

  async selectEventType(eventTypeName: string): Promise<void> {
    await this.page.getByText(eventTypeName).first().click();

    await this.page.getByLabel('Name').waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillGuestDetails(name: string, email: string): Promise<void> {
    await this.page.getByLabel('Name').fill(name);
    await this.page.getByLabel('Email').fill(email);
  }

  async submitBooking(): Promise<void> {
    await this.page.getByRole('button', { name: 'Confirm Booking' }).click();

    await this.page.getByText('Booking Confirmed', { exact: true }).waitFor({ state: 'visible' });
  }

  async submitBookingExpectingErrors(...errorMessages: string[]): Promise<void> {
    await this.page.getByRole('button', { name: 'Confirm Booking' }).click();

    for (const message of errorMessages) {
      await this.page.getByText(message, { exact: true }).waitFor({ state: 'visible' });
    }
  }

  async getConfirmation(): Promise<{
    eventName: string;
    guestName: string;
    guestEmail: string;
  } | null> {
    const confirmed = await this.page.getByText('Booking Confirmed', { exact: true }).isVisible();
    if (!confirmed) {
      return null;
    }

    const eventName = (await this.page
      .getByText('Event Type', { exact: true })
      .locator('..')
      .locator('.mantine-Badge-label')
      .textContent()) ?? '';
    const guestName = await this.page
      .getByText('Name', { exact: true })
      .locator('..')
      .locator('p')
      .nth(1)
      .innerText();
    const guestEmail = await this.page
      .getByText('Email', { exact: true })
      .locator('..')
      .locator('p')
      .nth(1)
      .innerText();

    return { eventName, guestName, guestEmail };
  }
}

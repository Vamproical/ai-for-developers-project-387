import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import { test, expect } from '../fixtures/base-fixtures';
import {
  createBooking,
  createEventType,
  listSlots,
} from '../fixtures/api-seed';
import { createWeeklySchedule } from '../fixtures/test-data';
import { AdminBookingsPage } from '../pages/admin-bookings.page';
import { AdminEventTypesPage } from '../pages/admin-event-types.page';
import { AdminSchedulesPage } from '../pages/admin-schedules.page';
import { AdminSettingsPage } from '../pages/admin-settings.page';

dayjs.extend(utc);
dayjs.extend(timezone);

test.describe('Event types — isolated CRUD', () => {
  test('admin edits an event type and sees the updated values in the table', async ({ page }) => {
    const original = {
      name: 'Consultation',
      description: 'Initial consultation',
      durationMinutes: 45,
    };
    await createEventType(original.name, original.description, original.durationMinutes);

    const updatedName = 'Consultation 60';
    const updatedDuration = 60;

    const adminEventTypesPage = new AdminEventTypesPage(page);
    await adminEventTypesPage.navigate();
    await adminEventTypesPage.editEventType(original.name, {
      name: updatedName,
      durationMinutes: updatedDuration,
    });

    await expect.poll(() => adminEventTypesPage.getEventTypes()).toContainEqual({
      name: updatedName,
      description: original.description,
      duration: String(updatedDuration),
    });

    await expect.poll(() => adminEventTypesPage.getEventTypes()).not.toContainEqual(
      expect.objectContaining({ name: original.name }),
    );
  });

  test('admin deletes an event type and it disappears from the table', async ({ page }) => {
    const target = {
      name: 'To Delete',
      description: 'Will be removed',
      durationMinutes: 30,
    };
    await createEventType(target.name, target.description, target.durationMinutes);

    const adminEventTypesPage = new AdminEventTypesPage(page);
    await adminEventTypesPage.navigate();
    await adminEventTypesPage.deleteEventType(target.name);

    await expect.poll(() => adminEventTypesPage.getEventTypes()).not.toContainEqual(
      expect.objectContaining({ name: target.name }),
    );
  });
});

test.describe('Bookings — isolated cancel', () => {
  test('admin cancels a booking and the slot returns to available', async ({ page }) => {
    const eventTypeName = 'Consultation';
    const guestName = 'Cancel Me';
    const guestEmail = 'cancel-me@example.com';

    const eventType = await createEventType(eventTypeName, 'Initial consultation', 30);
    await createWeeklySchedule();

    const slots = await listSlots({ eventTypeId: eventType.id });
    expect(slots.length).toBeGreaterThan(0);
    const slot = slots[0];

    await createBooking({
      slotId: slot.id,
      eventTypeId: eventType.id,
      guestName,
      guestEmail,
    });

    const adminBookingsPage = new AdminBookingsPage(page);
    await adminBookingsPage.navigate();
    await adminBookingsPage.cancelBooking(guestEmail);

    await expect.poll(() => adminBookingsPage.getBookings()).toContainEqual(
      expect.objectContaining({ guest: guestName, email: guestEmail, status: 'cancelled' }),
    );

    const slotsAfter = await listSlots({ eventTypeId: eventType.id });
    expect(slotsAfter.find((item) => item.id === slot.id)?.status).toBe('available');
  });
});

test.describe('Settings — isolated timezone', () => {
  test('changing the timezone updates the owner store and the Schedules dates', async ({ page }) => {
    const ownerName = 'E2E Owner';
    const newTimezone = 'Pacific/Tongatapu';

    const { startDate, endDate } = await createWeeklySchedule();

    const adminSettingsPage = new AdminSettingsPage(page);
    await adminSettingsPage.navigate();
    await adminSettingsPage.setName(ownerName);
    await adminSettingsPage.setTimezone(newTimezone);
    await adminSettingsPage.save();

    const ownerStoreUrl = '/src/shared/stores/owner.ts';
    const storeTimezone = await page.evaluate(async (moduleUrl: string) => {
      const mod = (await import(/* @vite-ignore */ moduleUrl)) as {
        useOwnerStore: {
          getState: () => { settings: { timezone: string } };
        };
      };
      return mod.useOwnerStore.getState().settings.timezone;
    }, ownerStoreUrl);
    expect(storeTimezone).toBe(newTimezone);

    await adminSettingsPage.openSchedules();

    const adminSchedulesPage = new AdminSchedulesPage(page);
    const expectedStartDate = dayjs.utc(startDate).tz(newTimezone).format('DD MMM YYYY');
    const expectedEndDate = dayjs.utc(endDate).tz(newTimezone).format('DD MMM YYYY');

    await expect.poll(() => adminSchedulesPage.getSchedules()).toContainEqual(
      expect.objectContaining({ dateRange: `${expectedStartDate} – ${expectedEndDate}` }),
    );
  });
});

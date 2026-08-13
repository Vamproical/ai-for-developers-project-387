import { test, expect } from '../fixtures/base-fixtures';
import {
  cancelBookingRaw,
  createBooking,
  createBookingRaw,
  createEventType,
  listSlots,
} from '../fixtures/api-seed';
import { createWeeklySchedule } from '../fixtures/test-data';
import { GuestPage } from '../pages/guest.page';
import { AdminBookingsPage } from '../pages/admin-bookings.page';
import { AdminEventTypesPage } from '../pages/admin-event-types.page';
import { AdminSchedulesPage } from '../pages/admin-schedules.page';

test.describe('Guest booking — validation errors', () => {
  test('empty required fields block submission and highlight the fields', async ({ page }) => {
    const eventTypeName = 'Consultation';
    await createEventType(eventTypeName, 'Initial consultation', 30);
    await createWeeklySchedule();

    const guestPage = new GuestPage(page);
    await guestPage.navigate();

    const slots = await guestPage.getAvailableSlots();
    expect(slots.length).toBeGreaterThan(0);
    await guestPage.selectSlot(slots[0].id);
    await guestPage.selectEventType(eventTypeName);

    await guestPage.submitBookingExpectingErrors('Name is required', 'Invalid email format');

    await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Booking Confirmed', { exact: true })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm Booking' })).toBeVisible();
  });

  test('invalid email shows a format error and does not submit', async ({ page }) => {
    const eventTypeName = 'Consultation';
    await createEventType(eventTypeName, 'Initial consultation', 30);
    await createWeeklySchedule();

    const guestPage = new GuestPage(page);
    await guestPage.navigate();

    const slots = await guestPage.getAvailableSlots();
    expect(slots.length).toBeGreaterThan(0);
    await guestPage.selectSlot(slots[0].id);
    await guestPage.selectEventType(eventTypeName);

    await guestPage.fillGuestDetails('Test User', 'not-an-email');

    await guestPage.submitBookingExpectingErrors('Invalid email format');

    await expect(page.getByText('Booking Confirmed', { exact: true })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm Booking' })).toBeVisible();
  });
});

test.describe('Bookings — cancellation edge cases', () => {
  test('cancelling an already-cancelled booking is blocked by the UI and rejected with 400', async ({ page }) => {
    const eventTypeName = 'Consultation';
    const guestName = 'Cancel Twice';
    const guestEmail = 'cancel-twice@example.com';

    const eventType = await createEventType(eventTypeName, 'Initial consultation', 30);
    await createWeeklySchedule();

    const slots = await listSlots({ eventTypeId: eventType.id });
    expect(slots.length).toBeGreaterThan(0);

    const booking = await createBooking({
      slotId: slots[0].id,
      eventTypeId: eventType.id,
      guestName,
      guestEmail,
    });

    const adminBookingsPage = new AdminBookingsPage(page);
    await adminBookingsPage.navigate();
    await adminBookingsPage.cancelBooking(guestEmail);
    await adminBookingsPage.waitForCancelDisabled(guestEmail);

    const result = await cancelBookingRaw(booking.id);
    expect(result.status).toBe(400);
    expect(result.message).toBe('Booking is already cancelled');
  });
});

test.describe('Guest slots — conflict handling', () => {
  test('a booked slot is not shown as available and creating a booking returns 409', async ({ page }) => {
    const eventTypeName = 'Consultation';
    const guestName = 'Slot Taker';
    const guestEmail = 'slot-taker@example.com';

    const eventType = await createEventType(eventTypeName, 'Initial consultation', 30);
    await createWeeklySchedule();

    const slots = await listSlots({ eventTypeId: eventType.id });
    expect(slots.length).toBeGreaterThan(0);
    const bookedSlot = slots[0];

    await createBooking({
      slotId: bookedSlot.id,
      eventTypeId: eventType.id,
      guestName,
      guestEmail,
    });

    const guestPage = new GuestPage(page);
    await guestPage.navigate();

    const available = await guestPage.getAvailableSlots();
    expect(available.length).toBeGreaterThan(0);
    expect(available.map((slot) => slot.id)).not.toContain(bookedSlot.id);

    const result = await createBookingRaw({
      slotId: bookedSlot.id,
      eventTypeId: eventType.id,
      guestName,
      guestEmail,
    });
    expect(result.status).toBe(409);
    expect(result.message).toBe('Slot is not available');
  });
});

test.describe('Empty states', () => {
  test('empty database shows the EmptyState on all admin list pages', async ({ page }) => {
    const adminEventTypesPage = new AdminEventTypesPage(page);
    await adminEventTypesPage.navigate();
    await expect(page.getByText('No event types yet', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Create your first event type to get started.', { exact: true }),
    ).toBeVisible();

    const adminSchedulesPage = new AdminSchedulesPage(page);
    await adminSchedulesPage.navigate();
    await expect(page.getByText('No schedules yet', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Create your first schedule to define your availability.', { exact: true }),
    ).toBeVisible();

    const adminBookingsPage = new AdminBookingsPage(page);
    await adminBookingsPage.navigate();
    await expect(page.getByText('No bookings found', { exact: true })).toBeVisible();
    await expect(page.getByText('There are no bookings yet.', { exact: true })).toBeVisible();
  });
});

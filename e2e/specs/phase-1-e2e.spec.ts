import dayjs from 'dayjs';
import { test, expect } from '../fixtures/base-fixtures';
import { listBookings } from '../fixtures/api-seed';
import { AdminBookingsPage } from '../pages/admin-bookings.page';
import { AdminEventTypesPage } from '../pages/admin-event-types.page';
import { AdminSchedulesPage } from '../pages/admin-schedules.page';
import { GuestPage } from '../pages/guest.page';

test.describe('Full booking flow E2E', () => {
  test('admin creates resources, guest books, admin verifies and filters', async ({ page }) => {
    const adminEventTypesPage = new AdminEventTypesPage(page);
    const adminSchedulesPage = new AdminSchedulesPage(page);
    const guestPage = new GuestPage(page);
    const adminBookingsPage = new AdminBookingsPage(page);

    const weekStart = dayjs().startOf('day');
    const weekEnd = weekStart.add(6, 'day');
    const eventTypeName = '30-min Meeting';
    const eventDescription = 'A quick 30-minute meeting';
    const guestName = 'Test User';
    const guestEmail = 'test-user@example.com';

    await test.step('Admin creates EventType through UI', async () => {
      await adminEventTypesPage.navigate();
      await adminEventTypesPage.createEventType(eventTypeName, eventDescription, 30);

      await expect.poll(() => adminEventTypesPage.getEventTypes()).toContainEqual({
        name: eventTypeName,
        description: eventDescription,
        duration: '30',
      });
    });

    await test.step('Admin creates Schedule through UI', async () => {
      await adminSchedulesPage.navigate();
      await adminSchedulesPage.createSchedule(
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        '09:00',
        '17:00',
        weekStart.format('YYYY-MM-DD'),
        weekEnd.format('YYYY-MM-DD'),
        30,
      );

      await expect.poll(() => adminSchedulesPage.getSchedules()).toHaveLength(1);
    });

    let selectedSlotId = '';

    await test.step('Guest selects an available slot', async () => {
      await guestPage.navigate();

      const slots = await guestPage.getAvailableSlots();
      expect(slots.length).toBeGreaterThan(0);
      selectedSlotId = slots[0].id;
      await guestPage.selectSlot(selectedSlotId);
    });

    await test.step('Guest completes booking', async () => {
      await guestPage.selectEventType(eventTypeName);
      await guestPage.fillGuestDetails(guestName, guestEmail);
      await guestPage.submitBooking();

      const confirmation = await guestPage.getConfirmation();
      expect(confirmation).toEqual({
        eventName: eventTypeName,
        guestName,
        guestEmail,
      });
    });

    await test.step('Admin sees and filters the booking', async () => {
      await adminBookingsPage.navigate();

      expect(await adminBookingsPage.getBookings()).toContainEqual(expect.objectContaining({
        guest: guestName,
        email: guestEmail,
        eventType: eventTypeName,
        status: 'confirmed',
      }));

      await adminBookingsPage.filterByEventType(eventTypeName);
      expect(await adminBookingsPage.getFilteredBookings()).toContainEqual(expect.objectContaining({
        guest: guestName,
        eventType: eventTypeName,
      }));

      await adminBookingsPage.filterByStatus('confirmed');
      expect(await adminBookingsPage.getFilteredBookings()).toContainEqual(expect.objectContaining({
        guest: guestName,
        status: 'confirmed',
      }));
    });

    await test.step('Booking is persisted in the API', async () => {
      const booking = (await listBookings()).find((item) => item.guestEmail === guestEmail);

      expect(booking).toEqual(expect.objectContaining({
        slotId: selectedSlotId,
        guestName,
        guestEmail,
        status: 'confirmed',
      }));
    });
  });
});

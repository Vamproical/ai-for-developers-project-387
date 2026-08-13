import { describe, it, expect, beforeEach } from 'vitest';
import { useBookingStore } from '../booking';
import type { Slot, EventType, Booking } from '@/shared/api/types';

describe('booking store', () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
  });

  it('has initial state', () => {
    const state = useBookingStore.getState();
    expect(state.selectedSlot).toBeNull();
    expect(state.selectedEventType).toBeNull();
    expect(state.createdBooking).toBeNull();
    expect(state.step).toBe('initial');
  });

  it('sets selected slot and advances step', () => {
    const slot = { id: '1', eventTypeId: 'et1', startDateTime: '2024-06-15T14:00:00Z', endDateTime: '2024-06-15T15:00:00Z', status: 'available' } as Slot;
    useBookingStore.getState().setSelectedSlot(slot);
    const state = useBookingStore.getState();
    expect(state.selectedSlot).toEqual(slot);
    expect(state.step).toBe('slot-selected');
  });

  it('sets selected event type and advances step', () => {
    const eventType = { id: 'et1', name: 'Meeting', description: 'Test', durationMinutes: 30 } as EventType;
    useBookingStore.getState().setSelectedEventType(eventType);
    const state = useBookingStore.getState();
    expect(state.selectedEventType).toEqual(eventType);
    expect(state.step).toBe('event-selected');
  });

  it('sets created booking and advances step', () => {
    const booking = { id: 'b1', slotId: '1', eventTypeId: 'et1', guestName: 'John', guestEmail: 'john@example.com', createdAt: '2024-06-15T14:00:00Z', status: 'confirmed' } as Booking;
    useBookingStore.getState().setCreatedBooking(booking);
    const state = useBookingStore.getState();
    expect(state.createdBooking).toEqual(booking);
    expect(state.step).toBe('confirmed');
  });

  it('resets all state', () => {
    const slot = { id: '1', eventTypeId: 'et1', startDateTime: '2024-06-15T14:00:00Z', endDateTime: '2024-06-15T15:00:00Z', status: 'available' } as Slot;
    useBookingStore.getState().setSelectedSlot(slot);
    useBookingStore.getState().reset();
    const state = useBookingStore.getState();
    expect(state.selectedSlot).toBeNull();
    expect(state.selectedEventType).toBeNull();
    expect(state.createdBooking).toBeNull();
    expect(state.step).toBe('initial');
  });
});

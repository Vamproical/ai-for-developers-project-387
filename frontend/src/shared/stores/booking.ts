import { create } from 'zustand';
import type { Slot, EventType, Booking } from '@/shared/api/types';

type BookingStep = 'initial' | 'slot-selected' | 'event-selected' | 'confirmed';

interface BookingState {
  selectedSlot: Slot | null;
  selectedEventType: EventType | null;
  createdBooking: Booking | null;
  step: BookingStep;
  setSelectedSlot: (slot: Slot) => void;
  setSelectedEventType: (eventType: EventType) => void;
  setCreatedBooking: (booking: Booking) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedSlot: null,
  selectedEventType: null,
  createdBooking: null,
  step: 'initial',
  setSelectedSlot: (slot: Slot) =>
    set({ selectedSlot: slot, step: 'slot-selected' }),
  setSelectedEventType: (eventType: EventType) =>
    set({ selectedEventType: eventType, step: 'event-selected' }),
  setCreatedBooking: (booking: Booking) =>
    set({ createdBooking: booking, step: 'confirmed' }),
  reset: () =>
    set({
      selectedSlot: null,
      selectedEventType: null,
      createdBooking: null,
      step: 'initial',
    }),
}));

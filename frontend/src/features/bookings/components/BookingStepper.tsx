import { useState } from 'react';
import { Stepper } from '@mantine/core';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { EventTypeSelection } from './EventTypeSelection';
import { GuestDetailsForm } from './GuestDetailsForm';
import { BookingConfirmation } from './BookingConfirmation';
import type { Slot, EventType, Booking, CreateBookingRequest } from '@/shared/api/types';

interface BookingStepperProps {
  selectedSlot: Slot;
  eventTypes: EventType[];
  onReset: () => void;
}

type BookingStep = 'select-event-type' | 'guest-details' | 'confirmation';

export function BookingStepper({ selectedSlot, eventTypes, onReset }: BookingStepperProps) {
  const [step, setStep] = useState<BookingStep>('select-event-type');
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const createBookingMutation = useCreateBooking();

  const handleEventTypeSelect = (eventType: EventType) => {
    setSelectedEventType(eventType);
    setStep('guest-details');
  };

  const handleGuestDetailsSubmit = (data: CreateBookingRequest) => {
    createBookingMutation.mutate(data, {
      onSuccess: (booking) => {
        setCreatedBooking(booking);
        setStep('confirmation');
      },
    });
  };

  const handleBookAnother = () => {
    setStep('select-event-type');
    setSelectedEventType(null);
    setCreatedBooking(null);
    onReset();
  };

  const stepIndex = step === 'select-event-type' ? 0 : step === 'guest-details' ? 1 : 2;

  return (
    <Stepper active={stepIndex} orientation="vertical">
      <Stepper.Step label="Select Event Type" description="Choose the type of meeting">
        <EventTypeSelection
          eventTypes={eventTypes}
          onSelect={handleEventTypeSelect}
        />
      </Stepper.Step>

      <Stepper.Step label="Your Details" description="Fill in your information">
        {selectedEventType && (
          <GuestDetailsForm
            slotId={selectedSlot.id}
            eventTypeId={selectedEventType.id}
            onSubmit={handleGuestDetailsSubmit}
          />
        )}
      </Stepper.Step>

      <Stepper.Step label="Confirmation" description="Booking confirmed">
        {createdBooking && selectedEventType && (
          <BookingConfirmation
            booking={createdBooking}
            eventType={selectedEventType}
            slotStartDateTime={selectedSlot.startDateTime}
            onBookAnother={handleBookAnother}
          />
        )}
      </Stepper.Step>

      <Stepper.Completed>
        {createdBooking && selectedEventType && (
          <BookingConfirmation
            booking={createdBooking}
            eventType={selectedEventType}
            slotStartDateTime={selectedSlot.startDateTime}
            onBookAnother={handleBookAnother}
          />
        )}
      </Stepper.Completed>
    </Stepper>
  );
}

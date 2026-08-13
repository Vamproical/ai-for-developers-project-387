import { useState } from 'react';
import { Text, Loader, Flex } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { listEventTypes } from '@/shared/api/event-types';
import { SlotBrowser } from '@/features/slots/components/SlotBrowser';
import { BookingStepper } from '@/features/bookings/components/BookingStepper';
import type { Slot, EventType } from '@/shared/api/types';

export function GuestPage() {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const { data: eventTypes, isLoading: isLoadingEventTypes } = useQuery<EventType[]>({
    queryKey: ['eventTypes'],
    queryFn: listEventTypes,
  });

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleReset = () => {
    setSelectedSlot(null);
  };

  return (
    <div>
      <Text size="xl" fw={600} mb="md">Book a Meeting</Text>

      {selectedSlot ? (
        <div>
          <Text size="sm" c="dimmed" mb="lg">
            Selected slot: {new Date(selectedSlot.startDateTime).toLocaleString()}
          </Text>
          {isLoadingEventTypes ? (
            <Flex justify="center" py="xl">
              <Loader />
            </Flex>
          ) : eventTypes ? (
            <BookingStepper
              selectedSlot={selectedSlot}
              eventTypes={eventTypes}
              onReset={handleReset}
            />
          ) : (
            <Text c="red">Failed to load event types.</Text>
          )}
        </div>
      ) : (
        <SlotBrowser onSlotSelect={handleSlotSelect} />
      )}
    </div>
  );
}

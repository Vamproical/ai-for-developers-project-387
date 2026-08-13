import { useState, useMemo } from 'react';
import {
  Text,
  Group,
  Button,
  Loader,
  EmptyState,
  Paper,
  Stack,
  Flex,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useSlots } from '../hooks/useSlots';
import { SlotChip } from './SlotChip';
import { toLocalTime, formatTime, formatDate } from '@/shared/lib/timezone';
import type { Slot } from '@/shared/api/types';

interface SlotBrowserProps {
  onSlotSelect: (slot: Slot) => void;
}

interface DaySlots {
  date: dayjs.Dayjs;
  slots: Slot[];
}

function WeekNavigation({
  weekStart,
  weekEnd,
  onPrev,
  onNext,
}: {
  weekStart: dayjs.Dayjs;
  weekEnd: dayjs.Dayjs;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <Group justify="space-between" mb="md">
      <Button
        variant="subtle"
        leftSection={<IconChevronLeft size={16} />}
        onClick={onPrev}
        aria-label="Previous week"
      >
        Previous
      </Button>
      <Text fw={600}>
        {formatDate(weekStart, 'DD MMM')} — {formatDate(weekEnd, 'DD MMM YYYY')}
      </Text>
      <Button
        variant="subtle"
        rightSection={<IconChevronRight size={16} />}
        onClick={onNext}
        aria-label="Next week"
      >
        Next
      </Button>
    </Group>
  );
}

export function SlotBrowser({ onSlotSelect }: SlotBrowserProps) {
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week').add(1, 'day'));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const weekEnd = weekStart.add(6, 'day');

  const { data: slots, isLoading, isError } = useSlots({
    from: weekStart.startOf('day').toISOString(),
    to: weekEnd.endOf('day').toISOString(),
  });

  const availableSlots = useMemo(
    () => slots?.filter((s) => s.status === 'available') ?? [],
    [slots],
  );

  const slotsByDate = useMemo((): DaySlots[] => {
    const days: DaySlots[] = [];
    for (let i = 0; i < 7; i++) {
      const date = weekStart.add(i, 'day');
      const daySlots = availableSlots.filter((slot) =>
        toLocalTime(slot.startDateTime).isSame(date, 'day'),
      );
      if (daySlots.length > 0) {
        days.push({ date, slots: daySlots });
      }
    }
    return days;
  }, [availableSlots, weekStart]);

  const handlePrevWeek = () => setWeekStart((prev) => prev.subtract(7, 'day'));
  const handleNextWeek = () => setWeekStart((prev) => prev.add(7, 'day'));

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlotId((prev) => (prev === slot.id ? null : slot.id));
    onSlotSelect(slot);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" py="xl">
        <Loader />
        <Text ml="sm">Loading available slots...</Text>
      </Flex>
    );
  }

  return (
    <div>
      <WeekNavigation
        weekStart={weekStart}
        weekEnd={weekEnd}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
      />

      {isError && (
        <Text c="red">Failed to load slots. Please try again later.</Text>
      )}

      {!isError && availableSlots.length === 0 && (
        <EmptyState>
          <EmptyState.Title>No available slots</EmptyState.Title>
          <EmptyState.Description>
            There are no available slots for this week. Try navigating to a different week.
          </EmptyState.Description>
        </EmptyState>
      )}

      {!isError && availableSlots.length > 0 && (
        <Stack gap="md">
          {slotsByDate.map((day) => (
            <Paper key={day.date.toISOString()} p="md" withBorder>
              <Group mb="xs">
                <Text fw={600}>{formatDate(day.date, 'ddd, DD MMM')}</Text>
              </Group>
              <Flex wrap="wrap" gap="xs">
                {day.slots.map((slot) => {
                  const time = formatTime(toLocalTime(slot.startDateTime));
                  return (
                    <SlotChip
                      key={slot.id}
                      slotId={slot.id}
                      time={time}
                      selected={selectedSlotId === slot.id}
                      onSelect={() => handleSlotClick(slot)}
                    />
                  );
                })}
              </Flex>
            </Paper>
          ))}
        </Stack>
      )}
    </div>
  );
}

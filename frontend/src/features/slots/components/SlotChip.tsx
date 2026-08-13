import { Button } from '@mantine/core';

interface SlotChipProps {
  slotId: string;
  time: string;
  selected: boolean;
  onSelect: () => void;
}

export function SlotChip({ slotId, time, selected, onSelect }: SlotChipProps) {
  return (
    <Button
      variant={selected ? 'filled' : 'outline'}
      size="xs"
      radius="md"
      data-slot-id={slotId}
      data-selected={selected ? true : undefined}
      onClick={onSelect}
    >
      {time}
    </Button>
  );
}

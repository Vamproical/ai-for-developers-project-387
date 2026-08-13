import { Button, TextInput, Textarea, Stack, Group } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { CreateBookingRequest } from '@/shared/api/types';

const guestDetailsSchema = z.object({
  guestName: z.string().min(1, 'Name is required'),
  guestEmail: z.string().email('Invalid email format'),
  guestPhone: z.string().optional(),
  comment: z.string().optional(),
});

type GuestDetailsValues = z.infer<typeof guestDetailsSchema>;

interface GuestDetailsFormProps {
  slotId: string;
  eventTypeId: string;
  onSubmit: (data: CreateBookingRequest) => void;
}

export function GuestDetailsForm({ slotId, eventTypeId, onSubmit }: GuestDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestDetailsValues>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      comment: '',
    },
  });

  const handleFormSubmit = (data: GuestDetailsValues) => {
    onSubmit({
      slotId,
      eventTypeId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      comment: data.comment,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Your name"
          error={errors.guestName?.message}
          {...register('guestName')}
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          error={errors.guestEmail?.message}
          {...register('guestEmail')}
        />

        <TextInput
          label="Phone (optional)"
          placeholder="+1234567890"
          error={errors.guestPhone?.message}
          {...register('guestPhone')}
        />

        <Textarea
          label="Comment (optional)"
          placeholder="Any additional notes"
          error={errors.comment?.message}
          {...register('comment')}
        />

        <Group justify="flex-end">
          <Button type="submit">Confirm Booking</Button>
        </Group>
      </Stack>
    </form>
  );
}

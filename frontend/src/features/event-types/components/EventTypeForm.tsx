import { Button, TextInput, NumberInput, Stack, Group } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { eventTypeFormSchema } from '@/shared/lib/validation';
import type { EventTypeFormValues } from '@/shared/lib/validation';
import type { EventType } from '@/shared/api/types';
import { useCreateEventType, useUpdateEventType } from '../hooks/useEventTypes';

interface EventTypeFormProps {
  mode: 'create' | 'edit';
  eventType?: EventType;
  onClose: () => void;
}

export function EventTypeForm({ mode, eventType, onClose }: EventTypeFormProps) {
  const createMutation = useCreateEventType();
  const updateMutation = useUpdateEventType();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventTypeFormValues>({
    resolver: zodResolver(eventTypeFormSchema),
    defaultValues: {
      name: eventType?.name ?? '',
      description: eventType?.description ?? '',
      durationMinutes: eventType?.durationMinutes ?? undefined,
    },
  });

  const onSubmit = (data: EventTypeFormValues) => {
    if (mode === 'create') {
      createMutation.mutate(
        {
          name: data.name,
          description: data.description,
          durationMinutes: data.durationMinutes,
        },
        { onSuccess: onClose },
      );
    } else if (eventType) {
      updateMutation.mutate(
        {
          id: eventType.id,
          data: {
            name: data.name,
            description: data.description,
            durationMinutes: data.durationMinutes,
          },
        },
        { onSuccess: onClose },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Event type name"
          error={errors.name?.message}
          disabled={isPending}
          {...register('name')}
        />

        <TextInput
          label="Description"
          placeholder="Event type description"
          error={errors.description?.message}
          disabled={isPending}
          {...register('description')}
        />

        <Controller
          name="durationMinutes"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Duration (minutes)"
              placeholder="30"
              min={1}
              step={1}
              error={errors.durationMinutes?.message}
              disabled={isPending}
              value={field.value}
              onChange={(value) => field.onChange(value === '' ? undefined : Number(value))}
            />
          )}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

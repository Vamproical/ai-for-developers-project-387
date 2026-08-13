import { Button, TextInput, NumberInput, Stack, Group, Checkbox, Box } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { scheduleFormSchema } from '@/shared/lib/validation';
import type { ScheduleFormValues } from '@/shared/lib/validation';
import type { CreateScheduleRequest, DayOfWeek as DayOfWeekValue, Schedule } from '@/shared/api/types';
import { DayOfWeek } from '@/shared/api/types';
import { useCreateSchedule, useUpdateSchedule } from '../hooks/useSchedules';

const DAYS = [
  { value: DayOfWeek.Monday, label: 'Monday' },
  { value: DayOfWeek.Tuesday, label: 'Tuesday' },
  { value: DayOfWeek.Wednesday, label: 'Wednesday' },
  { value: DayOfWeek.Thursday, label: 'Thursday' },
  { value: DayOfWeek.Friday, label: 'Friday' },
  { value: DayOfWeek.Saturday, label: 'Saturday' },
  { value: DayOfWeek.Sunday, label: 'Sunday' },
];

interface ScheduleFormProps {
  mode: 'create' | 'edit';
  schedule?: Schedule;
  onClose: () => void;
}

export function ScheduleForm({ mode, schedule, onClose }: ScheduleFormProps) {
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      daysOfWeek: schedule?.daysOfWeek ?? [],
      startTime: schedule?.startTime ?? '',
      endTime: schedule?.endTime ?? '',
      startDate: schedule?.startDate
        ? new Date(schedule.startDate).toISOString().split('T')[0]
        : '',
      endDate: schedule?.endDate
        ? new Date(schedule.endDate).toISOString().split('T')[0]
        : '',
      slotDurationMinutes: schedule?.slotDurationMinutes ?? undefined,
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: ScheduleFormValues) => {
    const payload: CreateScheduleRequest = {
      ...data,
      daysOfWeek: data.daysOfWeek as DayOfWeekValue[],
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };

    if (mode === 'create') {
      createMutation.mutate(payload, { onSuccess: onClose });
    } else if (schedule) {
      updateMutation.mutate({ id: schedule.id, data: payload }, { onSuccess: onClose });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Controller
          name="daysOfWeek"
          control={control}
          render={({ field }) => (
            <Box>
              <Box component="label" fw={500} mb="xs" style={{ display: 'block' }}>
                Days of week
              </Box>
              <Group>
                {DAYS.map((day) => (
                  <Checkbox
                    key={day.value}
                    label={day.label}
                    checked={field.value.includes(day.value)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...field.value, day.value]
                        : field.value.filter((d: number) => d !== day.value);
                      field.onChange(newValue);
                    }}
                    disabled={isPending}
                  />
                ))}
              </Group>
              {errors.daysOfWeek && (
                <Box c="red" size="sm" mt="xs">{errors.daysOfWeek.message}</Box>
              )}
            </Box>
          )}
        />

        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Start time"
              type="time"
              placeholder="09:00"
              error={errors.startTime?.message}
              disabled={isPending}
              {...field}
            />
          )}
        />

        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <TextInput
              label="End time"
              type="time"
              placeholder="17:00"
              error={errors.endTime?.message}
              disabled={isPending}
              {...field}
            />
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Start date"
              type="date"
              error={errors.startDate?.message}
              disabled={isPending}
              {...field}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <TextInput
              label="End date"
              type="date"
              error={errors.endDate?.message}
              disabled={isPending}
              {...field}
            />
          )}
        />

        <Controller
          name="slotDurationMinutes"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Slot duration (minutes, optional)"
              placeholder="30"
              min={1}
              step={1}
              error={errors.slotDurationMinutes?.message}
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

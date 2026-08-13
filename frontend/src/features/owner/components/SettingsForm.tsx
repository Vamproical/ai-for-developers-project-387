import { Button, TextInput, Select, Stack, Group } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { settingsFormSchema } from '@/shared/lib/validation';
import type { SettingsFormValues } from '@/shared/lib/validation';
import { useOwnerStore } from '@/shared/stores/owner';
import { COMMON_IANA_TIMEZONES } from '@/shared/lib/timezones';
import { getBrowserTimezone } from '@/shared/lib/timezone';
import { notifications } from '@mantine/notifications';

export function SettingsForm() {
  const { settings, setName, setTimezone } = useOwnerStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: settings.name,
      timezone: settings.timezone || getBrowserTimezone(),
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    setName(data.name);
    setTimezone(data.timezone);
    notifications.show({
      title: 'Settings saved',
      message: 'Your settings have been updated successfully.',
      color: 'green',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Display name"
              placeholder="Your name"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...field}
            />
          )}
        />

        <Controller
          name="timezone"
          control={control}
          render={({ field }) => (
            <Select
              label="Timezone"
              placeholder="Select timezone"
              data={COMMON_IANA_TIMEZONES}
              searchable
              error={errors.timezone?.message}
              disabled={isSubmitting}
              {...field}
            />
          )}
        />

        <Group justify="flex-end">
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

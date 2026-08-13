import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { useState } from 'react';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}

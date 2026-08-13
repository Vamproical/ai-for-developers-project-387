import { createBrowserRouter } from 'react-router-dom';
import { GuestLayout } from './GuestLayout';
import { AdminLayout } from './AdminLayout';
import { GuestPage } from '@/features/bookings/pages/GuestPage';
import { AdminDashboardPage } from '@/features/owner/pages/AdminDashboardPage';
import { EventTypesPage } from '@/features/event-types/pages/EventTypesPage';
import { SchedulesPage } from '@/features/schedules/pages/SchedulesPage';
import { BookingsPage } from '@/features/bookings/pages/BookingsPage';
import { SettingsPage } from '@/features/owner/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { index: true, element: <GuestPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'event-types', element: <EventTypesPage /> },
      { path: 'schedules', element: <SchedulesPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

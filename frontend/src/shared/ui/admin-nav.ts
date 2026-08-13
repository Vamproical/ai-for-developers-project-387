import {
  IconCalendarEvent,
  IconCalendarStats,
  IconClock,
  IconDashboard,
  IconSettings,
} from '@tabler/icons-react';

export interface AdminNavItem {
  label: string;
  description?: string;
  icon: typeof IconDashboard;
  path: string;
}

export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', icon: IconDashboard, path: '/admin' },
  { label: 'Event Types', description: 'Manage your event types', icon: IconCalendarEvent, path: '/admin/event-types' },
  { label: 'Schedules', description: 'Set your availability', icon: IconClock, path: '/admin/schedules' },
  { label: 'Bookings', description: 'View and manage bookings', icon: IconCalendarStats, path: '/admin/bookings' },
  { label: 'Settings', description: 'Configure your preferences', icon: IconSettings, path: '/admin/settings' },
];

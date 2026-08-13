import "@typespec/http";
import "@typespec/rest";
import "@typespec/versioning";

using Http;
using Rest;
using TypeSpec.Versioning;

@service(#{
  title: "Booking Calendar API"
})
@versioned(Versions)
namespace BookingCalendar;

enum Versions {
  v1: "v1",
}

// ============================================================
// Common types
// ============================================================

enum BookingStatus {
  confirmed,
  cancelled,
}

enum SlotStatus {
  available,
  booked,
  blocked,
}

// ============================================================
// Domain models
// ============================================================

model Owner {
  id: string;
  name: string;
  email: string;
}

model EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

model Slot {
  id: string;
  eventTypeId: string;
  startDateTime: utcDateTime;
  endDateTime: utcDateTime;
  status: SlotStatus;
}

model Booking {
  id: string;
  slotId: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  comment?: string;
  createdAt: utcDateTime;
  status: BookingStatus;
}

model Schedule {
  id: string;
  daysOfWeek: int32[];
  startTime: string;
  endTime: string;
  startDate: utcDateTime;
  endDate: utcDateTime;
  slotDurationMinutes?: int32;
}

// ============================================================
// Request/Response models
// ============================================================

model CreateEventTypeRequest {
  name: string;
  description: string;
  durationMinutes: int32;
}

model UpdateEventTypeRequest {
  name?: string;
  description?: string;
  durationMinutes?: int32;
}

model CreateSlotRequest {
  eventTypeId: string;
  startDateTime: utcDateTime;
  endDateTime: utcDateTime;
}

model CreateScheduleRequest {
  daysOfWeek: int32[];
  startTime: string;
  endTime: string;
  startDate: utcDateTime;
  endDate: utcDateTime;
  slotDurationMinutes?: int32;
}

model CreateBookingRequest {
  slotId: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  comment?: string;
}

model UpdateBookingStatusRequest {
  status: BookingStatus;
}

model EventTypeList {
  items: EventType[];
}

model SlotList {
  items: Slot[];
}

model BookingList {
  items: Booking[];
}

model ScheduleList {
  items: Schedule[];
}

@error
model Error {
  code: int32;
  message: string;
}

// ============================================================
// Public API (Guest)
// ============================================================

@route("/event-types")
@tag("PublicEventTypes")
interface PublicEventTypes {
  @get list(): EventTypeList | Error;
}

@route("/slots")
@tag("PublicSlots")
interface PublicSlots {
  @get list(
    @query eventTypeId?: string,
    @query from?: utcDateTime,
    @query to?: utcDateTime
  ): SlotList | Error;
}

@route("/bookings")
@tag("PublicBookings")
interface PublicBookings {
  @post create(@body body: CreateBookingRequest): Booking | Error;
}

// ============================================================
// Admin API (Owner)
// ============================================================

@route("/admin/event-types")
@tag("AdminEventTypes")
interface AdminEventTypes {
  @get list(): EventTypeList | Error;
  @post create(@body body: CreateEventTypeRequest): EventType | Error;
  @put update(@path id: string, @body body: UpdateEventTypeRequest): EventType | Error;
  @delete delete(@path id: string): void | Error;
}

@route("/admin/slots")
@tag("AdminSlots")
interface AdminSlots {
  @get list(
    @query eventTypeId?: string,
    @query from?: utcDateTime,
    @query to?: utcDateTime
  ): SlotList | Error;
  @post create(@body body: CreateSlotRequest): Slot | Error;
}

@route("/admin/schedules")
@tag("AdminSchedules")
interface AdminSchedules {
  @get list(): ScheduleList | Error;
  @post create(@body body: CreateScheduleRequest): Schedule | Error;
}

@route("/admin/bookings")
@tag("AdminBookings")
interface AdminBookings {
  @get list(
    @query eventTypeId?: string,
    @query status?: BookingStatus,
    @query from?: utcDateTime,
    @query to?: utcDateTime
  ): BookingList | Error;
  @route("{id}/cancel") @patch cancel(@path id: string, @body body: UpdateBookingStatusRequest): Booking | Error;
}

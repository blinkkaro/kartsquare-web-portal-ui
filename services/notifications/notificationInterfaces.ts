export enum service_booking_events {
  SERVICE_REQUEST = 'service_request',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_COMPLETED = 'booking_completed',
}

export interface Notification {
  notification_id: string;
  user_id: string;
  type: service_booking_events;
  title: string;
  message: string;
  is_viewed: boolean;
  created_at: Date;
  updated_at: Date;
  booking_id: string;
  entity_id: string;
}

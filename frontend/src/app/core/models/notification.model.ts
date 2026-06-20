export interface NotificationResponse {
  id: number;
  message: string;
  status: string;
  sentAt: string;
  type: string;
  eventId?: number;
  eventTitle?: string;
  sessionId?: number;
  sessionTitle?: string;
}

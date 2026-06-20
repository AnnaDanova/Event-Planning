export interface NotificationTemplateResponse {
  id: number;
  eventId?: number;
  eventTitle?: string;
  sessionId?: number;
  sessionTitle?: string;
  message: string;
  scheduledAt: string;
  type: string;
}

export interface NotificationTemplateRequest {
  sessionId?: number;
  eventId: number;
  message: string;
  scheduledAt: string;
  type: string;
}

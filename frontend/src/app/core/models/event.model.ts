export interface EventCreateRequest {
  organizerId: number;
  title: string;
  description: string;
  venue: string;
  category: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface EventShortResponse {
  id: number;
  title: string;
  venue: string;
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  lowestPrice: number | null;
}

export interface EventDetailsResponse {
  id: number;
  title: string;
  description: string;
  venue: string;
  startTime: string;
  endTime: string;
  category: string;
  status: string;
  organizerName: string;
  organizerEmail: string;
  capacity: number;
  sessions: SessionResponse[];
  ticketCategories: TicketCategoryResponse[];
}

export interface SessionResponse {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface TicketCategoryResponse {
  id: number;
  name: string;
  price: number;
  availableTickets: number;
}

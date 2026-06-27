export interface TicketResponse {
  ticketId: number;
  eventId: number;
  eventTitle: string;
  eventVenue: string;
  eventDateTime: string;
  ticketCategoryName: string;
  pricePaid: number;
  purchaseDate: string;
  status: string;
}

export interface TicketPurchaseRequest {
    userId: number;
    ticketCategoryId: number;
}

export interface TicketCategoryResponse {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface TicketCategoryCreateRequest {
  name: string;
  quantity: number;
  price: number;
}

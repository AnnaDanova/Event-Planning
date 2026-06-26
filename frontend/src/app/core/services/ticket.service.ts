import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketPurchaseRequest, TicketResponse } from '../models/ticket.model';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  buyTicket(eventId: number, request: TicketPurchaseRequest): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(
      `${this.apiUrl}/${eventId}/tickets`,
      request
    );
  }

  getEventAttendees(eventId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      `${this.apiUrl}/${eventId}/attendees`
    );
  }
}

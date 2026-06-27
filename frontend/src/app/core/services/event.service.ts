import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EventCreateRequest,
  EventShortResponse,
  EventDetailsResponse
} from '../models/event.model';

@Injectable({
  providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<EventShortResponse[]> {
    return this.http.get<EventShortResponse[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<EventDetailsResponse> {
    return this.http.get<EventDetailsResponse>(`${this.apiUrl}/${id}`);
  }

  createEvent(eventData: EventCreateRequest): Observable<EventDetailsResponse> {
    return this.http.post<EventDetailsResponse>(this.apiUrl, eventData);
  }

  updateEvent(id: number, eventData: EventCreateRequest): Observable<EventDetailsResponse> {
    return this.http.put<EventDetailsResponse>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEventsByOrganizer(userId: number): Observable<EventShortResponse[]> {
    return this.http.get<EventShortResponse[]>(
      `${this.apiUrl}/organizer/${userId}`
    );
  }
}

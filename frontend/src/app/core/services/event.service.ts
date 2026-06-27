import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  getEvents(filters?: { category?: string; location?: string; keyword?: string; }): Observable<EventShortResponse[]> {
    let params = new HttpParams();
    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    if (filters?.location) {
      params = params.set('location', filters.location);
    }
    if (filters?.keyword) {
      params = params.set('keyword', filters.keyword);
    }
    return this.http.get<EventShortResponse[]>(this.apiUrl, { params });
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

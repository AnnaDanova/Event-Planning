import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {NotificationTemplateRequest, NotificationTemplateResponse} from '../models/notification-template.model';

@Injectable({providedIn: 'root'})
export class NotificationTemplateService {

  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  getTemplatesByEventId(eventId: number): Observable<NotificationTemplateResponse[]> {
    return this.http.get<NotificationTemplateResponse[]>(`${this.baseUrl}/${eventId}/notification-templates`);
  }

  createTemplate(eventId: number, request: NotificationTemplateRequest): Observable<NotificationTemplateResponse> {
    return this.http.post<NotificationTemplateResponse>(`${this.baseUrl}/${eventId}/notification-templates`, request);
  }
}

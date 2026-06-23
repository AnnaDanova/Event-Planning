import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SessionCreateRequest, SessionResponse, SessionMaterialResponse } from '../models/session.model';
import { SpeakerResponse } from '../models/speaker.model';

@Injectable({providedIn: 'root'})
export class SessionService {

  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  getSessionsByEventId(eventId: number): Observable<SessionResponse[]> {
    return this.http.get<SessionResponse[]>(`${this.baseUrl}/${eventId}/sessions`);
  }

  getSessionById(eventId: number, sessionId: number): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(`${this.baseUrl}/${eventId}/sessions/${sessionId}`);
  }

  createSession(eventId: number, request: SessionCreateRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.baseUrl}/${eventId}/sessions`, request);
  }

  updateSession(eventId: number, sessionId: number, request: SessionCreateRequest): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(`${this.baseUrl}/${eventId}/sessions/${sessionId}`, request);
  }

  deleteSession(eventId: number, sessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${eventId}/sessions/${sessionId}`);
  }

  addSpeakerToSession(eventId: number, sessionId: number, speakerId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${eventId}/sessions/${sessionId}/speakers`, speakerId);
  }

  removeSpeakerFromSession(eventId: number, sessionId: number, speakerId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${eventId}/sessions/${sessionId}/speakers/${speakerId}`);
  }

  getSpeakersBySessionId(eventId: number, sessionId: number): Observable<SpeakerResponse[]> {
    return this.http.get<SpeakerResponse[]>(`${this.baseUrl}/${eventId}/sessions/${sessionId}/speakers`);
  }

  uploadSessionMaterial(eventId: number, sessionId: number, file: File): Observable<SessionMaterialResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<SessionMaterialResponse>(`${this.baseUrl}/${eventId}/sessions/${sessionId}/materials`, formData);
  }

  getSessionMaterials(eventId: number, sessionId: number): Observable<SessionMaterialResponse[]> {
    return this.http.get<SessionMaterialResponse[]>(`${this.baseUrl}/${eventId}/sessions/${sessionId}/materials`);
  }

  deleteSessionMaterial(eventId: number, sessionId: number, materialId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${eventId}/sessions/${sessionId}/materials/${materialId}`);
  }

}

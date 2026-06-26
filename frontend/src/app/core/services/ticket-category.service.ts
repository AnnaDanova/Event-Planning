import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketCategoryCreateRequest, TicketCategoryResponse } from '../models/ticket-category.model';

@Injectable({
  providedIn: 'root'
})
export class TicketCategoryService {

  private apiUrl = "http://localhost:8080/api/events";

  constructor(private http: HttpClient) {}

  createCategory(eventId: number, request: TicketCategoryCreateRequest): Observable<TicketCategoryResponse>{
    return this.http.post<TicketCategoryResponse>(
      `${this.apiUrl}/${eventId}/ticket-categories`,
      request,
    )
  }

  getEventCategories(eventId: number): Observable<TicketCategoryResponse[]>{
    return this.http.get<TicketCategoryResponse[]>(
      `${this.apiUrl}/${eventId}/ticket-categories`
    );
  }

  updateCategory(eventId: number, categoryId: number, request: TicketCategoryCreateRequest): Observable<TicketCategoryResponse>{
    return this.http.put<TicketCategoryResponse>(
      `${this.apiUrl}/${eventId}/ticket-categories/${categoryId}`,
      request,
    )
  }

  deleteCategory(eventId:number, categoryId:number): Observable<void>{
    return this.http.delete<void>(
      `${this.apiUrl}/${eventId}/ticket-categories/${categoryId}`,
    )
  }
}






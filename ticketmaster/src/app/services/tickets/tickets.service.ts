import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { SearchParams, PaginationParams, Tickets, Ticket } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private apiService: ApiService) { }

  getTickets(url: string, params: PaginationParams): Observable<Tickets> {
    return this.apiService.get<Tickets>(url, { params });
  }

  getTicket(url: string): Observable<Ticket> {
    return this.apiService.get<Ticket>(url);
  }

  addTicket = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  }

  editTicket = (url: string, body: any): Observable<any> => {
    return this.apiService.put(url, body, {});
  }

  deleteTicket = (url: string, body: any): Observable<any> => {
    return this.apiService.delete(url, body);
  }

  searchTickets = (url: string, params: SearchParams): Observable<Tickets> => {
    return this.apiService.get<Tickets>(url, { params });
  }
}

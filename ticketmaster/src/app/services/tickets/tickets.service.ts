import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { Observable } from 'rxjs';
import { PaginationParams, Tickets, Ticket } from '../../../types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  // private readonly elasticsearch_index: string = environment.ELASTICSEARCH_INDEX;
  constructor(private apiService: ApiService, private elasticsearchService: ElasticsearchService) { }

  getTickets(url: string, params: PaginationParams): Observable<Tickets> {
    return this.apiService.get<Tickets>(url, { params });
  }

//   getTickets (params: PaginationParams): Observable<Tickets> {
//     return this.elasticsearchService.get<Tickets>(this.elasticsearch_index, params.page, params.perPage);
// }

  getTicket(url: string): Observable<Ticket> {
    return this.apiService.get<Ticket>(url);
  }

  addTicket = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  }

  editTicket = (url: string, body: any): Observable<any> => {
    return this.apiService.put(url, body, {});
  }

  deleteTicket = (url: string): Observable<any> => {
    return this.apiService.delete(url, {});
  }
}

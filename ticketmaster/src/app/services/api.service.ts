import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options, PaginationParams, Ticket } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  get<T>(url: string, options?: { params?: PaginationParams; responseType?: 'json' }): Observable<T> {
    let httpParams = new HttpParams();

    if (options?.params) {
      for (const key in options.params) {
        if (options.params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, options.params[key].toString());
        }
      }
    }

    return this.httpClient.get<T>(url, {
      params: httpParams,
      responseType: options?.responseType
    });
  }
  
  post<T>(url:string, body: Ticket, options: Options): Observable<T> {
    return this.httpClient.post<T>(url, body, options) as Observable<T>;
  }

  put<T>(url:string, body: Ticket, options: Options): Observable<T> {
    return this.httpClient.put<T>(url, body, options) as Observable<T>;
  }

  delete<T>(url:string, body: string): Observable<T> {
    return this.httpClient.delete<T>(url, { body: body }) as Observable<T>;
  }
}

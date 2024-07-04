import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client } from '@elastic/elasticsearch';

@Injectable({
  providedIn: 'root',
})
export class ElasticsearchService {

  constructor(private httpClient: HttpClient) {}

  // Method to perform a search query
  // get<T>(index: string, page: number, perPage: number): Observable<T> {
  //   const from = (page - 1) * perPage;
  //   const query = {
  //     from: from,
  //     size: perPage,
  //     query: {
  //       match_all: {},
  //     },
  //   };

  //   return new Observable<T>((observer) => {
  //     this.client
  //       .search({
  //         index: index,
  //         body: {
  //           from: (page - 1) * perPage,
  //           size: perPage,
  //           query: {
  //             match_all: {},
  //           },
  //         },
  //       })
  //       .then((res: any) => {
  //         observer.next(res.body.hits.hits);
  //         observer.complete();
  //       })
  //       .catch((err: any) => {
  //         observer.error(err.meta.body.error);
  //       });
  //   });
  // }

  // search<T>(index: string, query: any): Observable<T> {
  //   const url = `${this.baseUrl}/${index}/_search`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.httpClient.post<T>(url, query, { headers });
  // }

  // Method to fetch all documents from an index
  // get<T>(index: string, page: number, perPage: number): Observable<T> {
  //   const node = `https://${this.username}:${this.password}@${this.baseUrl}/${index}/_search`;
  //   const query = {
  //     from: (page - 1) * perPage,
  //     size: perPage,
  //     query: {
  //       match_all: {}
  //     }
  //   };
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.httpClient.post<T>(node, query, { headers });
  // }
}

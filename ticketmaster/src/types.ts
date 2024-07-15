import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

type PrimitiveOrReadonlyArray = string | number | boolean | ReadonlyArray<string | number | boolean>;

export interface Options {  
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    context?: HttpContext;
    params?: HttpParams | {
        [param: string]: PrimitiveOrReadonlyArray;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}

export interface Tickets {
    items: Ticket[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface Ticket {
    _id?: string;
    ticketId?: number;
    name: string;
    description: string;
    severity: number;
    status: string;
}

export interface PaginationParams {
    [params: string]: PrimitiveOrReadonlyArray;
    page: number;
    perPage: number;
}

export interface SearchParams { 
    [params: string]: PrimitiveOrReadonlyArray;
    indexName: string;
    query: string;
    page: number;
    perPage: number;
}


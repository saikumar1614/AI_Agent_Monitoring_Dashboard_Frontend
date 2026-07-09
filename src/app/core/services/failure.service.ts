import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Failure, FailureFilters, FailureListResponse, FailureAnalytics } from '../models/failure.model';

@Injectable({
  providedIn: 'root'
})
export class FailureService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.failures.list}`;

  constructor(private http: HttpClient) {}

  getFailures(page: number = 1, pageSize: number = 10, filters?: FailureFilters): Observable<FailureListResponse> {
    let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<FailureListResponse>(this.baseUrl, { params });
  }

  getFailureById(id: string): Observable<Failure> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Failure>(url);
  }

  getAnalytics(): Observable<FailureAnalytics> {
    const url = `${environment.apiUrl}${environment.endpoints.failures.analytics}`;
    return this.http.get<FailureAnalytics>(url);
  }

  updateResolution(id: string, status: string, notes?: string): Observable<Failure> {
    const url = `${environment.apiUrl}${environment.endpoints.failures.resolution.replace(':id', id)}`;
    return this.http.post<Failure>(url, { status, notes });
  }
}
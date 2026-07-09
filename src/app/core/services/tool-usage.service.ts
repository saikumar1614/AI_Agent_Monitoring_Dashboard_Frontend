import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToolUsage, ToolUsageFilters, ToolUsageListResponse, ToolUsageAnalytics } from '../models/tool-usage.model';

@Injectable({
  providedIn: 'root'
})
export class ToolUsageService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.toolUsage.list}`;

  constructor(private http: HttpClient) {}

  getToolUsages(page: number = 1, pageSize: number = 10, filters?: ToolUsageFilters): Observable<ToolUsageListResponse> {
    let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<ToolUsageListResponse>(this.baseUrl, { params });
  }

  getToolUsageById(id: string): Observable<ToolUsage> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<ToolUsage>(url);
  }

  getAnalytics(): Observable<ToolUsageAnalytics> {
    const url = `${environment.apiUrl}${environment.endpoints.toolUsage.analytics}`;
    return this.http.get<ToolUsageAnalytics>(url);
  }
}
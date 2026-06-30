import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Agent, AgentListResponse, CreateAgentPayload, UpdateAgentPayload } from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.agents.list}`;

  constructor(private http: HttpClient) {}

  getAgents(page: number = 1, pageSize: number = 10, filters?: any): Observable<AgentListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<AgentListResponse>(this.baseUrl, { params });
  }

  getAgentById(id: string): Observable<Agent> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Agent>(url);
  }

  createAgent(payload: CreateAgentPayload): Observable<Agent> {
    return this.http.post<Agent>(this.baseUrl, payload);
  }

  updateAgent(id: string, payload: UpdateAgentPayload): Observable<Agent> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Agent>(url, payload);
  }

  deleteAgent(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  updateAgentStatus(id: string, status: string): Observable<Agent> {
    const url = `${this.baseUrl}/${id}/status`;
    return this.http.patch<Agent>(url, { status });
  }
}

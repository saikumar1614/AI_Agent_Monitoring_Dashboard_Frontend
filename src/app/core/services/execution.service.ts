import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Execution, ExecutionFilters, ExecutionListResponse, ExecutionLogEntry } from '../models/execution.model';

@Injectable({
	providedIn: 'root'
})
export class ExecutionService {
	private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.executions.list}`;

	constructor(private http: HttpClient) {}

	getExecutions(page: number = 1, pageSize: number = 10, filters?: ExecutionFilters): Observable<ExecutionListResponse> {
		let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params = params.set(key, String(value));
				}
			});
		}

		return this.http.get<ExecutionListResponse>(this.baseUrl, { params });
	}

	getExecutionById(id: string): Observable<Execution> {
		return this.http.get<Execution>(`${this.baseUrl}/${id}`);
	}

	getExecutionLogs(id: string): Observable<ExecutionLogEntry[]> {
		return this.http.get<ExecutionLogEntry[]>(`${this.baseUrl}/${id}/logs`);
	}

	cancelExecution(id: string): Observable<Execution> {
		return this.http.post<Execution>(`${this.baseUrl}/${id}/cancel`, {});
	}

	retryExecution(id: string): Observable<Execution> {
		return this.http.post<Execution>(`${this.baseUrl}/${id}/retry`, {});
	}
}

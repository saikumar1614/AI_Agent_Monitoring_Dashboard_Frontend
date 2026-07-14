import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	CostAnalyticsResponse,
	CostFilters,
	LatencyAnalyticsResponse,
	LatencyFilters,
	TokenAnalyticsResponse,
	TokenFilters
} from '../models/analytics.model';

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {
	private readonly baseUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	getLatencyAnalytics(filters?: LatencyFilters): Observable<LatencyAnalyticsResponse> {
		let params = new HttpParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params = params.set(key, String(value));
				}
			});
		}

		const url = `${this.baseUrl}${environment.endpoints.analytics.latency}`;
		return this.http.get<LatencyAnalyticsResponse>(url, { params });
	}

	getTokenAnalytics(filters?: TokenFilters): Observable<TokenAnalyticsResponse> {
		let params = new HttpParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params = params.set(key, String(value));
				}
			});
		}

		const url = `${this.baseUrl}${environment.endpoints.analytics.tokens}`;
		return this.http.get<TokenAnalyticsResponse>(url, { params });
	}

	getCostAnalytics(filters?: CostFilters): Observable<CostAnalyticsResponse> {
		let params = new HttpParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params = params.set(key, String(value));
				}
			});
		}

		const url = `${this.baseUrl}${environment.endpoints.analytics.cost}`;
		return this.http.get<CostAnalyticsResponse>(url, { params });
	}
}

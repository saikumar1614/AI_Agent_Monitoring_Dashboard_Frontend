import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardMetrics, DashboardOverview, DashboardRecentActivity } from '../models/dashboard.model';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private readonly baseUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	getOverview(timeRange: string = '24h'): Observable<DashboardOverview> {
		const params = new HttpParams().set('timeRange', timeRange);
		const url = `${this.baseUrl}${environment.endpoints.dashboard.overview}`;
		return this.http.get<DashboardOverview>(url, { params });
	}

	getMetrics(timeRange: string = '24h'): Observable<DashboardMetrics> {
		const params = new HttpParams().set('timeRange', timeRange);
		const url = `${this.baseUrl}${environment.endpoints.dashboard.metrics}`;
		return this.http.get<DashboardMetrics>(url, { params });
	}

	getRecentActivity(limit: number = 5): Observable<DashboardRecentActivity> {
		const params = new HttpParams().set('limit', String(limit));
		const url = `${this.baseUrl}${environment.endpoints.dashboard.recentActivity}`;
		return this.http.get<DashboardRecentActivity>(url, { params });
	}
}

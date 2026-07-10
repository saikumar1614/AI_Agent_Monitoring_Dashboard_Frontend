export interface LatencyFilters {
	fromDate?: string;
	toDate?: string;
	granularity?: 'hour' | 'day' | 'week';
	agentId?: string;
}

export interface LatencySummary {
	averageMs: number;
	p95Ms: number;
	p99Ms: number;
	maxMs: number;
	totalRequests: number;
	slowRate: number;
}

export interface LatencyTrendPoint {
	timestamp: string;
	averageMs: number;
	p95Ms: number;
	p99Ms: number;
	requestCount: number;
}

export interface LatencyByAgent {
	agentId: string;
	agentName: string;
	averageMs: number;
	p95Ms: number;
	requestCount: number;
}

export interface LatencyByEndpoint {
	endpoint: string;
	averageMs: number;
	p95Ms: number;
	requestCount: number;
}

export interface LatencyAnalyticsResponse {
	summary: LatencySummary;
	trend: LatencyTrendPoint[];
	byAgent: LatencyByAgent[];
	byEndpoint: LatencyByEndpoint[];
}

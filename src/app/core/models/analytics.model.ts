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

export interface TokenFilters {
	fromDate?: string;
	toDate?: string;
	granularity?: 'hour' | 'day' | 'week';
	agentId?: string;
}

export interface TokenSummary {
	totalTokens: number;
	inputTokens: number;
	outputTokens: number;
	averageTokensPerRequest: number;
	totalRequests: number;
	averageCostPerRequest: number;
	totalCost: number;
}

export interface TokenTrendPoint {
	timestamp: string;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	requestCount: number;
}

export interface TokenByAgent {
	agentId: string;
	agentName: string;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	requestCount: number;
}

export interface TokenByModel {
	model: string;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
}

export interface TokenAnalyticsResponse {
	summary: TokenSummary;
	trend: TokenTrendPoint[];
	byAgent: TokenByAgent[];
	byModel: TokenByModel[];
}

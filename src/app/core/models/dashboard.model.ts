export type DashboardTrend = 'up' | 'down' | 'neutral';

export interface DashboardKpi {
	key: 'totalExecutions' | 'successRate' | 'avgLatencyMs' | 'dailyCost';
	value: number;
	change: number;
	subtitle?: string;
}

export interface DashboardOverview {
	kpis: DashboardKpi[];
	statusDistribution: {
		completed: number;
		running: number;
		failed: number;
		queued: number;
	};
	alerts: DashboardAlert[];
}

export interface DashboardLatencyPoint {
	label: string;
	p95: number;
}

export interface DashboardCostPoint {
	agentName: string;
	cost: number;
}

export interface DashboardMetrics {
	latencyTrend: DashboardLatencyPoint[];
	costByAgent: DashboardCostPoint[];
}

export interface DashboardRecentExecution {
	id: string;
	agentName: string;
	status: 'completed' | 'failed' | 'running' | 'queued';
	duration?: string;
	durationMs?: number;
	startedAt?: string;
	timeAgo?: string;
}

export interface DashboardAlert {
	severity: 'high' | 'medium' | 'low';
	title: string;
	description: string;
	timestamp: string;
}

export interface DashboardRecentActivity {
	executions: DashboardRecentExecution[];
	alerts: DashboardAlert[];
}

export interface DashboardData {
	overview: DashboardOverview;
	metrics: DashboardMetrics;
	recentActivity: DashboardRecentActivity;
}

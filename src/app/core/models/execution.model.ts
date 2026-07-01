export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ExecutionLogEntry {
	timestamp: string;
	level: 'info' | 'warn' | 'error' | 'debug';
	message: string;
}

export interface Execution {
	id: string;
	agentId: string;
	agentName?: string;
	status: ExecutionStatus;
	startedAt: string;
	endedAt?: string;
	durationMs?: number;
	tokensInput?: number;
	tokensOutput?: number;
	totalTokens?: number;
	cost?: number;
	triggeredBy?: string;
	errorMessage?: string;
	metadata?: Record<string, unknown>;
	logs?: ExecutionLogEntry[];
}

export interface ExecutionFilters {
	status?: ExecutionStatus | '';
	agentId?: string;
	search?: string;
	fromDate?: string;
	toDate?: string;
}

export interface ExecutionListResponse {
	data: Execution[];
	total: number;
	page: number;
	pageSize: number;
}

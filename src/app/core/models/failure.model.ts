export type FailureSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FailureResolutionStatus = 'unresolved' | 'investigating' | 'resolved' | 'ignored';

export interface FailureStackTrace {
  line: number;
  column: number;
  file: string;
  function: string;
  code: string;
}

export interface Failure {
  id: string;
  executionId: string;
  agentId: string;
  agentName?: string;
  errorType: string;
  errorMessage: string;
  severity: FailureSeverity;
  statusCode?: string | number;
  stackTrace?: FailureStackTrace[];
  context?: Record<string, unknown>;
  resolvedAt?: string;
  resolutionStatus: FailureResolutionStatus;
  notes?: string;
  occurredAt: string;
  occurrenceCount?: number;
}

export interface FailureAnalytics {
  totalFailures: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  resolvedCount: number;
  topErrorTypes: Array<{ type: string; count: number }>;
  affectedAgents: number;
}

export interface FailureFilters {
  severity?: FailureSeverity | '';
  status?: FailureResolutionStatus | '';
  agentId?: string;
  errorType?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FailureListResponse {
  data: Failure[];
  total: number;
  page: number;
  pageSize: number;
}
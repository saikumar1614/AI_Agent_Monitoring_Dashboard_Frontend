export interface ToolUsage {
  id: string;
  toolName: string;
  category: string;
  executionId: string;
  agentId: string;
  agentName?: string;
  callCount: number;
  successCount: number;
  failureCount: number;
  avgDurationMs: number;
  totalCost: number;
  firstUsedAt: string;
  lastUsedAt: string;
  parameters?: Record<string, unknown>;
}

export interface ToolUsageAnalytics {
  totalCalls: number;
  uniqueTools: number;
  successRate: number;
  averageCost: number;
  topTools: ToolUsage[];
}

export interface ToolUsageFilters {
  toolName?: string;
  category?: string;
  agentId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ToolUsageListResponse {
  data: ToolUsage[];
  total: number;
  page: number;
  pageSize: number;
}
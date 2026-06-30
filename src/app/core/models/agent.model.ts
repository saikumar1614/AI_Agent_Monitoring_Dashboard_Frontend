export interface Agent {
  id?: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'error' | 'paused';
  type: string;
  model?: string;
  config?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  lastRunAt?: Date;
  executionCount?: number;
  successRate?: number;
  averageLatency?: number;
  totalCost?: number;
}

export interface AgentListResponse {
  data: Agent[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateAgentPayload {
  name: string;
  description?: string;
  type: string;
  model?: string;
  config?: Record<string, any>;
}

export interface UpdateAgentPayload extends CreateAgentPayload {
  status?: 'active' | 'inactive' | 'error' | 'paused';
}

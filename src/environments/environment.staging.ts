export const environment = {
  production: false,
  apiUrl: 'https://staging-api.example.com/api',
  apiVersion: 'v1',
  timeout: 30000,

  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      verify: '/auth/verify'
    },
    agents: {
      list: '/agents',
      details: '/agents/:id',
      create: '/agents',
      update: '/agents/:id',
      delete: '/agents/:id',
      status: '/agents/:id/status'
    },
    executions: {
      list: '/executions',
      details: '/executions/:id',
      create: '/executions',
      cancel: '/executions/:id/cancel',
      retry: '/executions/:id/retry',
      logs: '/executions/:id/logs'
    },
    toolUsage: {
      list: '/tool-usage',
      details: '/tool-usage/:id',
      analytics: '/tool-usage/analytics/summary'
    },
    failures: {
      list: '/failures',
      details: '/failures/:id',
      analytics: '/failures/analytics/summary',
      resolution: '/failures/:id/resolution'
    },
    analytics: {
      latency: '/analytics/latency',
      tokens: '/analytics/tokens',
      cost: '/analytics/cost',
      performance: '/analytics/performance',
      summary: '/analytics/summary'
    },
    dashboard: {
      overview: '/dashboard/overview',
      metrics: '/dashboard/metrics',
      recentActivity: '/dashboard/recent-activity'
    },
    settings: {
      user: '/settings/user',
      preferences: '/settings/preferences',
      notifications: '/settings/notifications'
    }
  },

  features: {
    darkMode: true,
    notifications: true,
    realTimeUpdates: true,
    advancedAnalytics: true
  },

  logging: {
    enabled: true,
    level: 'info'
  },

  grafana: {
    enabled: true,
    baseUrl: 'https://staging-grafana.example.com',
    orgId: 1,
    tokenDashboardUid: 'token-analytics',
    tokenOverviewPanelId: 2,
    tokenRequestsPanelId: 4
  }
};

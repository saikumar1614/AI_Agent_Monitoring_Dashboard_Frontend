import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DashboardAlert,
  DashboardKpi,
  DashboardMetrics,
  DashboardOverview,
  DashboardRecentActivity,
  DashboardRecentExecution
} from '../core/models/dashboard.model';
import { DashboardService } from '../core/services/dashboard.service';

interface KpiCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  accent: string;
  subtitle: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  readonly currentDate = new Date();
  isLoading = false;
  loadError = false;
  readonly selectedTimeRange = '24h';

  kpiCards: KpiCard[] = [
    {
      title: 'Total Executions',
      value: '12,840',
      change: '+8.4% vs last week',
      trend: 'up',
      icon: 'play_circle',
      accent: '#1d4ed8',
      subtitle: 'Across all agents'
    },
    {
      title: 'Success Rate',
      value: '97.6%',
      change: '+1.2% improvement',
      trend: 'up',
      icon: 'verified',
      accent: '#0f766e',
      subtitle: '24h execution window'
    },
    {
      title: 'Avg Latency',
      value: '742 ms',
      change: '-5.1% lower than yesterday',
      trend: 'up',
      icon: 'speed',
      accent: '#8b5cf6',
      subtitle: 'P95 response duration'
    },
    {
      title: 'Daily Cost',
      value: '$384.29',
      change: '+3.8% spend variance',
      trend: 'down',
      icon: 'payments',
      accent: '#b45309',
      subtitle: 'Token + tool usage'
    }
  ];

  recentExecutions: DashboardRecentExecution[] = [
    { id: 'exec_98412', agentName: 'Fraud Guard', status: 'completed', duration: '0.9 s', timeAgo: '2 min ago' },
    { id: 'exec_98411', agentName: 'Catalog Copilot', status: 'running', duration: '1.4 s', timeAgo: '5 min ago' },
    { id: 'exec_98410', agentName: 'Support Summarizer', status: 'failed', duration: '0.3 s', timeAgo: '8 min ago' },
    { id: 'exec_98409', agentName: 'Invoice Assistant', status: 'completed', duration: '1.1 s', timeAgo: '13 min ago' },
    { id: 'exec_98408', agentName: 'Sentiment Scout', status: 'queued', duration: '-', timeAgo: '19 min ago' }
  ];

  alerts: DashboardAlert[] = [
    {
      severity: 'high',
      title: 'Spike in failed executions',
      description: 'Support Summarizer exceeded failure threshold of 3%.',
      timestamp: '4 min ago'
    },
    {
      severity: 'medium',
      title: 'Latency warning',
      description: 'Catalog Copilot P95 crossed 1.2s for 10-minute window.',
      timestamp: '12 min ago'
    },
    {
      severity: 'low',
      title: 'Cost trend increase',
      description: 'Daily spend is tracking 5% above baseline.',
      timestamp: '25 min ago'
    }
  ];

  statusDistributionData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completed', 'Running', 'Failed', 'Queued'],
    datasets: [
      {
        data: [78, 12, 6, 4],
        backgroundColor: ['#2e7d32', '#1976d2', '#c62828', '#ff8f00'],
        borderWidth: 0
      }
    ]
  };

  readonly statusDistributionOptions: ChartConfiguration<'doughnut'>['options'] = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    cutout: '62%'
  };

  latencyTrendData: ChartConfiguration<'line'>['data'] = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'P95 Latency (ms)',
        data: [810, 760, 730, 780, 720, 690],
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 3
      }
    ]
  };

  readonly latencyTrendOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  costByAgentData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Fraud Guard', 'Catalog Copilot', 'Support Summarizer', 'Invoice Assistant'],
    datasets: [
      {
        label: 'Cost ($)',
        data: [108, 96, 74, 52],
        borderRadius: 8,
        backgroundColor: ['#1d4ed8', '#0f766e', '#8b5cf6', '#b45309']
      }
    ]
  };

  readonly costByAgentOptions: ChartConfiguration<'bar'>['options'] = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  refreshDashboard(): void {
    this.loadDashboardData(true);
  }

  getExecutionStatusClass(status: string): string {
    return `status-${status}`;
  }

  getAlertSeverityClass(severity: string): string {
    return `severity-${severity}`;
  }

  getExecutionDuration(execution: DashboardRecentExecution): string {
    if (execution.duration) {
      return execution.duration;
    }

    if (execution.durationMs == null) {
      return '-';
    }

    if (execution.durationMs < 1000) {
      return `${execution.durationMs} ms`;
    }

    return `${(execution.durationMs / 1000).toFixed(1)} s`;
  }

  private loadDashboardData(showMessage: boolean = false): void {
    this.isLoading = true;
    this.loadError = false;

    forkJoin({
      overview: this.dashboardService.getOverview(this.selectedTimeRange).pipe(catchError(() => of(null))),
      metrics: this.dashboardService.getMetrics(this.selectedTimeRange).pipe(catchError(() => of(null))),
      recentActivity: this.dashboardService.getRecentActivity(6).pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ overview, metrics, recentActivity }) => {
        const normalizedOverview = this.extractPayload<DashboardOverview>(overview);
        const normalizedMetrics = this.extractPayload<DashboardMetrics>(metrics);
        const normalizedRecent = this.extractPayload<DashboardRecentActivity>(recentActivity);

        if (normalizedOverview) {
          this.applyOverview(normalizedOverview);
        }

        if (normalizedMetrics) {
          this.applyMetrics(normalizedMetrics);
        }

        if (normalizedRecent) {
          this.applyRecentActivity(normalizedRecent);
        }

        if (!normalizedOverview && !normalizedMetrics && !normalizedRecent) {
          this.loadError = true;
          this.snackBar.open('Dashboard data unavailable. Showing fallback values.', 'Close', { duration: 4000 });
        } else if (showMessage) {
          this.snackBar.open('Dashboard refreshed', 'Close', { duration: 2500 });
        }

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.loadError = true;
        this.snackBar.open('Failed to refresh dashboard data', 'Close', { duration: 4000 });
      }
    });
  }

  private applyOverview(overview: DashboardOverview): void {
    if (Array.isArray(overview.kpis) && overview.kpis.length) {
      this.kpiCards = this.mapKpis(overview.kpis);
    }

    if (overview.statusDistribution) {
      const dist = overview.statusDistribution;
      this.statusDistributionData = {
        ...this.statusDistributionData,
        datasets: [
          {
            ...this.statusDistributionData.datasets[0],
            data: [dist.completed || 0, dist.running || 0, dist.failed || 0, dist.queued || 0]
          }
        ]
      };
    }

    if (Array.isArray(overview.alerts) && overview.alerts.length) {
      this.alerts = overview.alerts;
    }
  }

  private applyMetrics(metrics: DashboardMetrics): void {
    if (Array.isArray(metrics.latencyTrend) && metrics.latencyTrend.length) {
      this.latencyTrendData = {
        ...this.latencyTrendData,
        labels: metrics.latencyTrend.map((point) => point.label),
        datasets: [
          {
            ...this.latencyTrendData.datasets[0],
            data: metrics.latencyTrend.map((point) => point.p95 || 0)
          }
        ]
      };
    }

    if (Array.isArray(metrics.costByAgent) && metrics.costByAgent.length) {
      this.costByAgentData = {
        ...this.costByAgentData,
        labels: metrics.costByAgent.map((point) => point.agentName),
        datasets: [
          {
            ...this.costByAgentData.datasets[0],
            data: metrics.costByAgent.map((point) => point.cost || 0)
          }
        ]
      };
    }
  }

  private applyRecentActivity(recent: DashboardRecentActivity): void {
    if (Array.isArray(recent.executions) && recent.executions.length) {
      this.recentExecutions = recent.executions;
    }

    if (Array.isArray(recent.alerts) && recent.alerts.length) {
      this.alerts = recent.alerts;
    }
  }

  private mapKpis(kpis: DashboardKpi[]): KpiCard[] {
    const config: Record<DashboardKpi['key'], { title: string; icon: string; accent: string; unit?: string; subtitle: string }> = {
      totalExecutions: { title: 'Total Executions', icon: 'play_circle', accent: '#1d4ed8', subtitle: 'Across all agents' },
      successRate: { title: 'Success Rate', icon: 'verified', accent: '#0f766e', unit: '%', subtitle: '24h execution window' },
      avgLatencyMs: { title: 'Avg Latency', icon: 'speed', accent: '#8b5cf6', unit: ' ms', subtitle: 'P95 response duration' },
      dailyCost: { title: 'Daily Cost', icon: 'payments', accent: '#b45309', unit: '$', subtitle: 'Token + tool usage' }
    };

    return kpis
      .filter((kpi) => !!config[kpi.key])
      .map((kpi) => {
        const kpiConfig = config[kpi.key];
        const trend: 'up' | 'down' | 'neutral' = kpi.change > 0 ? 'up' : (kpi.change < 0 ? 'down' : 'neutral');
        const absChange = Math.abs(kpi.change).toFixed(1);
        const changeLabel = `${kpi.change >= 0 ? '+' : '-'}${absChange}% vs previous period`;

        let value = String(kpi.value);
        if (kpi.key === 'dailyCost') {
          value = `$${kpi.value.toFixed(2)}`;
        } else if (kpiConfig.unit === '%') {
          value = `${kpi.value.toFixed(1)}%`;
        } else if (kpiConfig.unit === ' ms') {
          value = `${Math.round(kpi.value)} ms`;
        } else {
          value = Math.round(kpi.value).toLocaleString();
        }

        return {
          title: kpiConfig.title,
          value,
          change: changeLabel,
          trend,
          icon: kpiConfig.icon,
          accent: kpiConfig.accent,
          subtitle: kpi.subtitle || kpiConfig.subtitle
        };
      });
  }

  private extractPayload<T>(response: unknown): T | null {
    if (!response) {
      return null;
    }

    const asObject = response as Record<string, unknown>;
    if (asObject['data']) {
      return asObject['data'] as T;
    }

    return response as T;
  }
}

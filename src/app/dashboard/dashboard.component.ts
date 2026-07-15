import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Subscription, forkJoin, interval, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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

interface DashboardSummaryItem {
  title: string;
  value: string;
  hint: string;
  tone: 'good' | 'warn' | 'danger' | 'info';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly currentDate = new Date();
  isLoading = false;
  loadError = false;
  readonly selectedTimeRange = '24h';
  autoRefreshEnabled = true;
  lastUpdated: Date | null = null;
  readonly refreshIntervalOptions: Array<{ label: string; value: number }> = [
    { label: '10 sec', value: 10000 },
    { label: '30 sec', value: 30000 },
    { label: '60 sec', value: 60000 }
  ];
  selectedRefreshIntervalMs = 30000;
  private refreshSubscription: Subscription | null = null;

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

  summaryItems: DashboardSummaryItem[] = [
    { title: 'Active Queue', value: '16', hint: 'Running + queued executions', tone: 'info' },
    { title: 'Failure Ratio', value: '6.0%', hint: 'Current execution failure rate', tone: 'warn' },
    { title: 'Open Alerts', value: '3', hint: 'Monitoring alerts requiring review', tone: 'danger' },
    { title: 'Top Cost Agent', value: 'Fraud Guard', hint: '$108 highest spend today', tone: 'good' }
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
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  refreshDashboard(): void {
    this.loadDashboardData(true);
  }

  openCostDashboard(): void {
    this.router.navigate(['/analytics/cost']);
  }

  onAutoRefreshToggle(enabled: boolean): void {
    this.autoRefreshEnabled = enabled;

    if (enabled) {
      this.startAutoRefresh();
      this.snackBar.open('Auto refresh enabled', 'Close', { duration: 2000 });
      return;
    }

    this.stopAutoRefresh();
    this.snackBar.open('Auto refresh paused', 'Close', { duration: 2000 });
  }

  onRefreshIntervalChange(value: number): void {
    this.selectedRefreshIntervalMs = value;

    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
    }
  }

  getExecutionStatusClass(status: string): string {
    return `status-${status}`;
  }

  getAlertSeverityClass(severity: string): string {
    return `severity-${severity}`;
  }

  trackByKpi(index: number, item: KpiCard): string {
    return item.title;
  }

  trackBySummary(index: number, item: DashboardSummaryItem): string {
    return item.title;
  }

  trackByExecution(index: number, item: DashboardRecentExecution): string {
    return item.id;
  }

  trackByAlert(index: number, item: DashboardAlert): string {
    return `${item.title}-${item.timestamp}`;
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

  private loadDashboardData(showMessage: boolean = false, fromAutoRefresh: boolean = false): void {
    if (!fromAutoRefresh) {
      this.isLoading = true;
    }
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
          if (!fromAutoRefresh) {
            this.snackBar.open('Dashboard data unavailable. Showing fallback values.', 'Close', { duration: 4000 });
          }
        } else if (showMessage) {
          this.snackBar.open('Dashboard refreshed', 'Close', { duration: 2500 });
        }

        this.lastUpdated = new Date();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.loadError = true;
        if (!fromAutoRefresh) {
          this.snackBar.open('Failed to refresh dashboard data', 'Close', { duration: 4000 });
        }
      }
    });
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();

    this.refreshSubscription = interval(this.selectedRefreshIntervalMs).subscribe(() => {
      if (this.autoRefreshEnabled) {
        this.loadDashboardData(false, true);
      }
    });
  }

  private stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  private applyOverview(overview: DashboardOverview): void {
    if (Array.isArray(overview.kpis) && overview.kpis.length) {
      this.kpiCards = this.mapKpis(overview.kpis);
    }

    if (overview.statusDistribution) {
      const dist = overview.statusDistribution;
      this.updateSummaryFromStatus(dist.completed || 0, dist.running || 0, dist.failed || 0, dist.queued || 0);
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
      this.updateSummaryAlerts(overview.alerts.length);
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
      this.updateSummaryTopCost(metrics.costByAgent.map((point) => ({
        agentName: point.agentName,
        cost: point.cost || 0
      })));
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
      this.updateSummaryAlerts(recent.alerts.length);
    }
  }

  private updateSummaryFromStatus(completed: number, running: number, failed: number, queued: number): void {
    const total = completed + running + failed + queued;
    const failureRatio = total > 0 ? ((failed / total) * 100) : 0;
    const queue = running + queued;

    this.setSummaryValue('Active Queue', String(queue), 'Running + queued executions');
    this.setSummaryValue('Failure Ratio', `${failureRatio.toFixed(1)}%`, 'Current execution failure rate');
  }

  private updateSummaryAlerts(alertCount: number): void {
    this.setSummaryValue('Open Alerts', String(alertCount), 'Monitoring alerts requiring review');
  }

  private updateSummaryTopCost(points: Array<{ agentName: string; cost: number }>): void {
    const top = points.reduce((prev, curr) => curr.cost > prev.cost ? curr : prev, points[0]);
    this.setSummaryValue('Top Cost Agent', top.agentName, `$${top.cost.toFixed(2)} highest spend today`);
  }

  private setSummaryValue(title: string, value: string, hint: string): void {
    this.summaryItems = this.summaryItems.map((item) => item.title === title ? { ...item, value, hint } : item);
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

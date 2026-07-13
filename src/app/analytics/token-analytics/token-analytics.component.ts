import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import {
  TokenAnalyticsResponse,
  TokenByAgent,
  TokenByModel,
  TokenFilters,
  TokenSummary,
  TokenTrendPoint
} from '../../core/models/analytics.model';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-token-analytics',
  templateUrl: './token-analytics.component.html',
  styleUrls: ['./token-analytics.component.css']
})
export class TokenAnalyticsComponent implements OnInit {
  isLoading = false;
  filterForm: FormGroup;

  summary: TokenSummary = {
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    averageTokensPerRequest: 0,
    totalRequests: 0,
    averageCostPerRequest: 0,
    totalCost: 0
  };

  trendChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  agentChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  modelChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Tokens'
        }
      }
    }
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Tokens'
        }
      }
    }
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  grafanaOverviewUrl: SafeResourceUrl | null = null;
  grafanaRequestsUrl: SafeResourceUrl | null = null;

  readonly grafanaEnabled = !!environment.grafana?.enabled;
  readonly grafanaBaseUrl = environment.grafana?.baseUrl || '';

  constructor(
    private fb: FormBuilder,
    private analyticsService: AnalyticsService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);

    this.filterForm = this.fb.group({
      fromDate: this.toInputDate(from),
      toDate: this.toInputDate(today),
      granularity: 'day'
    });
  }

  ngOnInit(): void {
    this.loadTokenAnalytics();
  }

  applyFilters(): void {
    this.loadTokenAnalytics();
  }

  resetFilters(): void {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);

    this.filterForm.patchValue({
      fromDate: this.toInputDate(from),
      toDate: this.toInputDate(today),
      granularity: 'day'
    });

    this.loadTokenAnalytics();
  }

  setQuickRange(days: number): void {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - days);

    this.filterForm.patchValue({
      fromDate: this.toInputDate(from),
      toDate: this.toInputDate(today),
      granularity: days <= 2 ? 'hour' : 'day'
    });

    this.loadTokenAnalytics();
  }

  openGrafana(): void {
    if (!this.grafanaBaseUrl) {
      return;
    }

    const fullUrl = this.buildGrafanaDashboardUrl(false);
    window.open(fullUrl, '_blank');
  }

  private loadTokenAnalytics(): void {
    this.isLoading = true;
    const filters = this.normalizeFilters(this.filterForm.getRawValue());

    this.analyticsService.getTokenAnalytics(filters).subscribe({
      next: (response) => {
        this.applyResponse(response);
        this.updateGrafanaUrls(filters);
        this.isLoading = false;
      },
      error: () => {
        this.resetViewData();
        this.updateGrafanaUrls(filters);
        this.isLoading = false;
        this.snackBar.open('Failed to load token analytics', 'Close', { duration: 3500 });
      }
    });
  }

  private applyResponse(response: TokenAnalyticsResponse): void {
    this.summary = response.summary || this.summary;
    this.applyTrendChart(response.trend || []);
    this.applyAgentChart(response.byAgent || []);
    this.applyModelChart(response.byModel || []);
  }

  private applyTrendChart(trend: TokenTrendPoint[]): void {
    this.trendChartData = {
      labels: trend.map((point) => this.toChartLabel(point.timestamp)),
      datasets: [
        {
          label: 'Input Tokens',
          data: trend.map((point) => point.inputTokens || 0),
          borderColor: '#1e88e5',
          backgroundColor: 'rgba(30, 136, 229, 0.15)',
          tension: 0.25,
          fill: false
        },
        {
          label: 'Output Tokens',
          data: trend.map((point) => point.outputTokens || 0),
          borderColor: '#43a047',
          backgroundColor: 'rgba(67, 160, 71, 0.15)',
          tension: 0.25,
          fill: false
        },
        {
          label: 'Total Tokens',
          data: trend.map((point) => point.totalTokens || 0),
          borderColor: '#ef6c00',
          backgroundColor: 'rgba(239, 108, 0, 0.15)',
          tension: 0.25,
          fill: false
        }
      ]
    };
  }

  private applyAgentChart(byAgent: TokenByAgent[]): void {
    const topAgents = byAgent.slice(0, 8);

    this.agentChartData = {
      labels: topAgents.map((item) => item.agentName || item.agentId),
      datasets: [
        {
          label: 'Input',
          data: topAgents.map((item) => item.inputTokens || 0),
          backgroundColor: '#5c6bc0'
        },
        {
          label: 'Output',
          data: topAgents.map((item) => item.outputTokens || 0),
          backgroundColor: '#26a69a'
        }
      ]
    };
  }

  private applyModelChart(byModel: TokenByModel[]): void {
    const topModels = byModel.slice(0, 8);
    const colors = ['#3949ab', '#00897b', '#ef6c00', '#7b1fa2', '#039be5', '#6d4c41', '#00838f', '#f4511e'];

    this.modelChartData = {
      labels: topModels.map((item) => item.model),
      datasets: [
        {
          data: topModels.map((item) => item.totalTokens || 0),
          backgroundColor: colors.slice(0, topModels.length)
        }
      ]
    };
  }

  private resetViewData(): void {
    this.summary = {
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      averageTokensPerRequest: 0,
      totalRequests: 0,
      averageCostPerRequest: 0,
      totalCost: 0
    };

    this.trendChartData = { labels: [], datasets: [] };
    this.agentChartData = { labels: [], datasets: [] };
    this.modelChartData = { labels: [], datasets: [] };
  }

  private updateGrafanaUrls(filters: TokenFilters): void {
    if (!this.grafanaEnabled || !this.grafanaBaseUrl || !environment.grafana?.tokenDashboardUid) {
      this.grafanaOverviewUrl = null;
      this.grafanaRequestsUrl = null;
      return;
    }

    const overviewUrl = this.buildGrafanaDashboardUrl(true, environment.grafana.tokenOverviewPanelId);
    const requestsUrl = this.buildGrafanaDashboardUrl(true, environment.grafana.tokenRequestsPanelId);

    this.grafanaOverviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(overviewUrl + this.buildGrafanaTimeQuery(filters));
    this.grafanaRequestsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(requestsUrl + this.buildGrafanaTimeQuery(filters));
  }

  private buildGrafanaDashboardUrl(embed: boolean, panelId?: number): string {
    const uid = environment.grafana?.tokenDashboardUid;
    const orgId = environment.grafana?.orgId || 1;
    const params = new URLSearchParams({ orgId: String(orgId) });

    if (embed) {
      params.set('kiosk', 'tv');
    }

    if (panelId) {
      params.set('viewPanel', String(panelId));
    }

    return `${this.grafanaBaseUrl}/d/${uid}/token-analytics?${params.toString()}`;
  }

  private buildGrafanaTimeQuery(filters: TokenFilters): string {
    const fromMs = filters.fromDate ? new Date(filters.fromDate).getTime() : Date.now() - 7 * 24 * 60 * 60 * 1000;
    const toMs = filters.toDate ? new Date(filters.toDate).getTime() + (24 * 60 * 60 * 1000 - 1) : Date.now();

    return `&from=${fromMs}&to=${toMs}`;
  }

  private normalizeFilters(raw: TokenFilters): TokenFilters {
    const formatDate = (value: unknown): string | undefined => {
      if (!value) {
        return undefined;
      }

      if (value instanceof Date) {
        return this.toInputDate(value);
      }

      return String(value);
    };

    return {
      fromDate: formatDate(raw.fromDate),
      toDate: formatDate(raw.toDate),
      granularity: raw.granularity || 'day'
    };
  }

  private toInputDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private toChartLabel(value: string): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return `${parsed.toLocaleDateString()} ${parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}

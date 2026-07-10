import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LatencyAnalyticsResponse,
  LatencyByAgent,
  LatencyByEndpoint,
  LatencyFilters,
  LatencySummary,
  LatencyTrendPoint
} from '../../core/models/analytics.model';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-latency-analytics',
  templateUrl: './latency-analytics.component.html',
  styleUrls: ['./latency-analytics.component.css']
})
export class LatencyAnalyticsComponent implements OnInit {
  isLoading = false;
  filterForm: FormGroup;

  summary: LatencySummary = {
    averageMs: 0,
    p95Ms: 0,
    p99Ms: 0,
    maxMs: 0,
    totalRequests: 0,
    slowRate: 0
  };

  trendChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  agentChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  endpointChartData: ChartConfiguration<'bar'>['data'] = {
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
          text: 'Latency (ms)'
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
          text: 'Latency (ms)'
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private analyticsService: AnalyticsService,
    private snackBar: MatSnackBar
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
    this.loadLatencyAnalytics();
  }

  applyFilters(): void {
    this.loadLatencyAnalytics();
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

    this.loadLatencyAnalytics();
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

    this.loadLatencyAnalytics();
  }

  private loadLatencyAnalytics(): void {
    this.isLoading = true;
    const filters = this.normalizeFilters(this.filterForm.getRawValue());

    this.analyticsService.getLatencyAnalytics(filters).subscribe({
      next: (response) => {
        this.applyResponse(response);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.resetViewData();
        this.snackBar.open('Failed to load latency analytics', 'Close', { duration: 3500 });
      }
    });
  }

  private applyResponse(response: LatencyAnalyticsResponse): void {
    this.summary = response.summary || this.summary;

    this.applyTrendChart(response.trend || []);
    this.applyAgentChart(response.byAgent || []);
    this.applyEndpointChart(response.byEndpoint || []);
  }

  private applyTrendChart(trend: LatencyTrendPoint[]): void {
    const labels = trend.map((point) => this.toChartLabel(point.timestamp));

    this.trendChartData = {
      labels,
      datasets: [
        {
          data: trend.map((point) => point.averageMs || 0),
          label: 'Average',
          borderColor: '#1e88e5',
          backgroundColor: 'rgba(30, 136, 229, 0.15)',
          tension: 0.25,
          fill: false
        },
        {
          data: trend.map((point) => point.p95Ms || 0),
          label: 'P95',
          borderColor: '#f4511e',
          backgroundColor: 'rgba(244, 81, 30, 0.15)',
          tension: 0.25,
          fill: false
        },
        {
          data: trend.map((point) => point.p99Ms || 0),
          label: 'P99',
          borderColor: '#6d4c41',
          backgroundColor: 'rgba(109, 76, 65, 0.15)',
          tension: 0.25,
          fill: false
        }
      ]
    };
  }

  private applyAgentChart(byAgent: LatencyByAgent[]): void {
    const topAgents = byAgent.slice(0, 8);

    this.agentChartData = {
      labels: topAgents.map((item) => item.agentName || item.agentId),
      datasets: [
        {
          data: topAgents.map((item) => item.averageMs || 0),
          label: 'Average',
          backgroundColor: '#43a047'
        },
        {
          data: topAgents.map((item) => item.p95Ms || 0),
          label: 'P95',
          backgroundColor: '#fb8c00'
        }
      ]
    };
  }

  private applyEndpointChart(byEndpoint: LatencyByEndpoint[]): void {
    const topEndpoints = byEndpoint.slice(0, 8);

    this.endpointChartData = {
      labels: topEndpoints.map((item) => item.endpoint),
      datasets: [
        {
          data: topEndpoints.map((item) => item.averageMs || 0),
          label: 'Average',
          backgroundColor: '#8e24aa'
        },
        {
          data: topEndpoints.map((item) => item.p95Ms || 0),
          label: 'P95',
          backgroundColor: '#ef5350'
        }
      ]
    };
  }

  private resetViewData(): void {
    this.summary = {
      averageMs: 0,
      p95Ms: 0,
      p99Ms: 0,
      maxMs: 0,
      totalRequests: 0,
      slowRate: 0
    };

    this.trendChartData = { labels: [], datasets: [] };
    this.agentChartData = { labels: [], datasets: [] };
    this.endpointChartData = { labels: [], datasets: [] };
  }

  private normalizeFilters(raw: LatencyFilters): LatencyFilters {
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

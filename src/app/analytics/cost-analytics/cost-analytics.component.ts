import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CostAnalyticsResponse,
  CostByAgent,
  CostByCategory,
  CostFilters,
  CostSummary,
  CostTrendPoint
} from '../../core/models/analytics.model';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-cost-analytics',
  templateUrl: './cost-analytics.component.html',
  styleUrls: ['./cost-analytics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CostAnalyticsComponent implements OnInit {
  isLoading = false;
  filterForm: FormGroup;

  summary: CostSummary = {
    totalCost: 0,
    averageCostPerRequest: 0,
    totalRequests: 0,
    totalTokens: 0,
    highestSingleExecutionCost: 0,
    costVariancePercent: 0
  };

  trendChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  agentChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  categoryChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  readonly lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Cost ($)'
        }
      }
    }
  };

  readonly barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Cost ($)'
        }
      }
    }
  };

  readonly doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
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
    this.loadCostAnalytics();
  }

  applyFilters(): void {
    this.loadCostAnalytics();
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

    this.loadCostAnalytics();
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

    this.loadCostAnalytics();
  }

  private loadCostAnalytics(): void {
    this.isLoading = true;
    const filters = this.normalizeFilters(this.filterForm.getRawValue());

    this.analyticsService.getCostAnalytics(filters).subscribe({
      next: (response) => {
        this.applyResponse(response);
        this.isLoading = false;
      },
      error: () => {
        this.resetViewData();
        this.isLoading = false;
        this.snackBar.open('Failed to load cost analytics', 'Close', { duration: 3500 });
      }
    });
  }

  private applyResponse(response: CostAnalyticsResponse): void {
    this.summary = response.summary || this.summary;
    this.applyTrendChart(response.trend || []);
    this.applyAgentChart(response.byAgent || []);
    this.applyCategoryChart(response.byCategory || []);
  }

  private applyTrendChart(trend: CostTrendPoint[]): void {
    this.trendChartData = {
      labels: trend.map((point) => this.toChartLabel(point.timestamp)),
      datasets: [
        {
          label: 'Cost',
          data: trend.map((point) => point.cost || 0),
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.16)',
          tension: 0.28,
          fill: true
        }
      ]
    };
  }

  private applyAgentChart(byAgent: CostByAgent[]): void {
    const topAgents = byAgent.slice(0, 8);

    this.agentChartData = {
      labels: topAgents.map((item) => item.agentName || item.agentId),
      datasets: [
        {
          label: 'Cost',
          data: topAgents.map((item) => item.cost || 0),
          backgroundColor: '#0d9488'
        }
      ]
    };
  }

  private applyCategoryChart(byCategory: CostByCategory[]): void {
    const topCategories = byCategory.slice(0, 8);
    const colors = ['#1d4ed8', '#0f766e', '#b45309', '#7c3aed', '#0369a1', '#4d7c0f', '#be185d', '#475569'];

    this.categoryChartData = {
      labels: topCategories.map((item) => item.category),
      datasets: [
        {
          data: topCategories.map((item) => item.cost || 0),
          backgroundColor: colors.slice(0, topCategories.length)
        }
      ]
    };
  }

  private resetViewData(): void {
    this.summary = {
      totalCost: 0,
      averageCostPerRequest: 0,
      totalRequests: 0,
      totalTokens: 0,
      highestSingleExecutionCost: 0,
      costVariancePercent: 0
    };

    this.trendChartData = { labels: [], datasets: [] };
    this.agentChartData = { labels: [], datasets: [] };
    this.categoryChartData = { labels: [], datasets: [] };
  }

  private normalizeFilters(raw: CostFilters): CostFilters {
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

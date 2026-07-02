import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

interface KpiCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  accent: string;
  subtitle: string;
}

interface RecentExecution {
  id: string;
  agentName: string;
  status: 'completed' | 'failed' | 'running' | 'queued';
  duration: string;
  timeAgo: string;
}

interface AlertItem {
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  readonly currentDate = new Date();

  readonly kpiCards: KpiCard[] = [
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

  readonly recentExecutions: RecentExecution[] = [
    { id: 'exec_98412', agentName: 'Fraud Guard', status: 'completed', duration: '0.9 s', timeAgo: '2 min ago' },
    { id: 'exec_98411', agentName: 'Catalog Copilot', status: 'running', duration: '1.4 s', timeAgo: '5 min ago' },
    { id: 'exec_98410', agentName: 'Support Summarizer', status: 'failed', duration: '0.3 s', timeAgo: '8 min ago' },
    { id: 'exec_98409', agentName: 'Invoice Assistant', status: 'completed', duration: '1.1 s', timeAgo: '13 min ago' },
    { id: 'exec_98408', agentName: 'Sentiment Scout', status: 'queued', duration: '-', timeAgo: '19 min ago' }
  ];

  readonly alerts: AlertItem[] = [
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

  readonly statusDistributionData: ChartConfiguration<'doughnut'>['data'] = {
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

  readonly latencyTrendData: ChartConfiguration<'line'>['data'] = {
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

  readonly costByAgentData: ChartConfiguration<'bar'>['data'] = {
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

  getExecutionStatusClass(status: string): string {
    return `status-${status}`;
  }

  getAlertSeverityClass(severity: string): string {
    return `severity-${severity}`;
  }
}

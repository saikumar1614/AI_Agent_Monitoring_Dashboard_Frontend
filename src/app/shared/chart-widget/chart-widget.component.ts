import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartWidgetComponent {
  @Input() title = '';
  @Input() chartType: ChartType = 'line';
  @Input() chartData: ChartConfiguration['data'] = { datasets: [] };
  @Input() chartOptions: ChartConfiguration['options'] = {};
  @Input() loading = false;
  @Input() error: string | null = null;
}

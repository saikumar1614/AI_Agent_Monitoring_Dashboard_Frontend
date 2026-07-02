import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.css']
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() change = '';
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() icon = 'monitoring';
  @Input() accent = '#0f766e';
  @Input() subtitle = '';

  get trendIcon(): string {
    if (this.trend === 'up') {
      return 'trending_up';
    }

    if (this.trend === 'down') {
      return 'trending_down';
    }

    return 'trending_flat';
  }
}

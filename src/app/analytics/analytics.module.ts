import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { LatencyAnalyticsComponent } from './latency-analytics/latency-analytics.component';
import { TokenAnalyticsComponent } from './token-analytics/token-analytics.component';
import { CostAnalyticsComponent } from './cost-analytics/cost-analytics.component';
import { PerformanceAnalyticsComponent } from './performance-analytics/performance-analytics.component';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    LatencyAnalyticsComponent,
    TokenAnalyticsComponent,
    CostAnalyticsComponent,
    PerformanceAnalyticsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgChartsModule,
    AnalyticsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class AnalyticsModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatencyAnalyticsComponent } from './latency-analytics/latency-analytics.component';
import { TokenAnalyticsComponent } from './token-analytics/token-analytics.component';
import { CostAnalyticsComponent } from './cost-analytics/cost-analytics.component';
import { PerformanceAnalyticsComponent } from './performance-analytics/performance-analytics.component';

const routes: Routes = [
  {
    path: 'latency',
    component: LatencyAnalyticsComponent,
    data: { title: 'Latency Analytics' }
  },
  {
    path: 'tokens',
    component: TokenAnalyticsComponent,
    data: { title: 'Token Analytics' }
  },
  {
    path: 'cost',
    component: CostAnalyticsComponent,
    data: { title: 'Cost Analytics' }
  },
  {
    path: 'performance',
    component: PerformanceAnalyticsComponent,
    data: { title: 'Performance Analytics' }
  },
  {
    path: '',
    redirectTo: 'latency',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }

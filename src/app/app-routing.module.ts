import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.component').then(m => ({
      default: m.DashboardComponent
    }))
  },
  {
    path: 'agents',
    canActivate: [AuthGuard],
    loadChildren: () => import('./agents/agents-routing.module').then(m => m.AgentsRoutingModule)
  },
  {
    path: 'executions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./executions/executions-routing.module').then(m => m.ExecutionsRoutingModule)
  },
  {
    path: 'tool-usage',
    canActivate: [AuthGuard],
    loadChildren: () => import('./tool-usage/tool-usage.module').then(m => m.ToolUsageModule)
  },
  {
    path: 'failures',
    canActivate: [AuthGuard],
    loadChildren: () => import('./failures/failures.module').then(m => m.FailuresModule)
  },
  {
    path: 'analytics',
    canActivate: [AuthGuard],
    loadChildren: () => import('./analytics/analytics-routing.module').then(m => m.AnalyticsRoutingModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./settings/settings.component').then(m => ({
      default: m.SettingsComponent
    }))
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

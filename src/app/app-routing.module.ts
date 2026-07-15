import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'agents',
    canActivate: [AuthGuard],
    loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule)
  },
  {
    path: 'executions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./executions/executions.module').then(m => m.ExecutionsModule)
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
    loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    useHash: false,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

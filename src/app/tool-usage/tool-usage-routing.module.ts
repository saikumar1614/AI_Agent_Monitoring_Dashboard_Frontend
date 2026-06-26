import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolUsageListComponent } from './tool-usage-list/tool-usage-list.component';
import { ToolUsageDetailsComponent } from './tool-usage-details/tool-usage-details.component';

const routes: Routes = [
  {
    path: '',
    component: ToolUsageListComponent,
    data: { title: 'Tool Usage' }
  },
  {
    path: ':id',
    component: ToolUsageDetailsComponent,
    data: { title: 'Tool Usage Details' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolUsageRoutingModule { }

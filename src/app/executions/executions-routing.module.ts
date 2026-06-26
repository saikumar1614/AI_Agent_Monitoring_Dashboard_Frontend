import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutionListComponent } from './execution-list/execution-list.component';
import { ExecutionDetailsComponent } from './execution-details/execution-details.component';

const routes: Routes = [
  {
    path: '',
    component: ExecutionListComponent,
    data: { title: 'Executions' }
  },
  {
    path: ':id',
    component: ExecutionDetailsComponent,
    data: { title: 'Execution Details' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutionsRoutingModule { }

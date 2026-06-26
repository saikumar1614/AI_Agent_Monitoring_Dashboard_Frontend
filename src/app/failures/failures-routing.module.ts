import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailureListComponent } from './failure-list/failure-list.component';
import { FailureDetailsComponent } from './failure-details/failure-details.component';

const routes: Routes = [
  {
    path: '',
    component: FailureListComponent,
    data: { title: 'Failures' }
  },
  {
    path: ':id',
    component: FailureDetailsComponent,
    data: { title: 'Failure Details' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FailuresRoutingModule { }

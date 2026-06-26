import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';

const routes: Routes = [
  {
    path: '',
    component: AgentListComponent,
    data: { title: 'Agents' }
  },
  {
    path: ':id',
    component: AgentDetailsComponent,
    data: { title: 'Agent Details' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }

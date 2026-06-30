import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentService } from '../../core/services/agent.service';
import { Agent } from '../../core/models/agent.model';

@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.css']
})
export class AgentDetailsComponent implements OnInit {
  agent: Agent | null = null;
  isLoading = true;
  agentId: string | null = null;

  constructor(
    private agentService: AgentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.agentId = params['id'];
      if (this.agentId) {
        this.loadAgent();
      }
    });
  }

  loadAgent(): void {
    if (!this.agentId) return;

    this.isLoading = true;
    this.agentService.getAgentById(this.agentId).subscribe({
      next: (agent: Agent) => {
        this.agent = agent;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load agent details', 'Close', { duration: 5000 });
        this.router.navigate(['/agents']);
        this.isLoading = false;
      }
    });
  }

  editAgent(): void {
    if (this.agent?.id) {
      this.router.navigate(['/agents', this.agent.id, 'edit']);
    }
  }

  deleteAgent(): void {
    if (!this.agent?.id || !confirm(`Delete agent "${this.agent.name}"?`)) {
      return;
    }

    this.agentService.deleteAgent(this.agent.id).subscribe({
      next: () => {
        this.snackBar.open('Agent deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/agents']);
      },
      error: () => {
        this.snackBar.open('Failed to delete agent', 'Close', { duration: 5000 });
      }
    });
  }

  updateStatus(newStatus: string): void {
    if (!this.agent?.id) return;

    this.agentService.updateAgentStatus(this.agent.id, newStatus).subscribe({
      next: (updatedAgent: Agent) => {
        this.agent = updatedAgent;
        this.snackBar.open('Agent status updated', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to update agent status', 'Close', { duration: 5000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/agents']);
  }

  getStatusClass(): string {
    return this.agent ? `status-${this.agent.status}` : '';
  }
}

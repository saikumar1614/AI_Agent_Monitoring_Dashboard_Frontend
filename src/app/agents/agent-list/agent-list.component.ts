import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { AgentService } from '../../core/services/agent.service';
import { Agent, AgentListResponse } from '../../core/models/agent.model';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {
  agents: Agent[] = [];
  displayedColumns: string[] = ['name', 'type', 'status', 'successRate', 'executionCount', 'averageLatency', 'actions'];
  
  isLoading = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  totalCount = 0;
  currentPage = 1;

  showAddForm = false;
  addEditForm!: FormGroup;
  editingAgentId: string | null = null;

  constructor(
    private agentService: AgentService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadAgents();
  }

  initForm(): void {
    this.addEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      type: ['', Validators.required],
      model: [''],
      config: ['']
    });
  }

  loadAgents(): void {
    this.isLoading = true;
    this.agentService.getAgents(this.currentPage, this.pageSize).subscribe({
      next: (response: AgentListResponse) => {
        this.agents = response.data;
        this.totalCount = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load agents', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAgents();
  }

  openAddForm(): void {
    this.editingAgentId = null;
    this.addEditForm.reset();
    this.showAddForm = true;
  }

  editAgent(agent: Agent): void {
    this.editingAgentId = agent.id || null;
    this.addEditForm.patchValue(agent);
    this.showAddForm = true;
  }

  submitForm(): void {
    if (this.addEditForm.invalid) {
      this.addEditForm.markAllAsTouched();
      return;
    }

    const payload = this.addEditForm.getRawValue();

    if (this.editingAgentId) {
      this.agentService.updateAgent(this.editingAgentId, payload).subscribe({
        next: () => {
          this.snackBar.open('Agent updated successfully', 'Close', { duration: 3000 });
          this.closeForm();
          this.loadAgents();
        },
        error: () => {
          this.snackBar.open('Failed to update agent', 'Close', { duration: 5000 });
        }
      });
    } else {
      this.agentService.createAgent(payload).subscribe({
        next: () => {
          this.snackBar.open('Agent created successfully', 'Close', { duration: 3000 });
          this.closeForm();
          this.loadAgents();
        },
        error: () => {
          this.snackBar.open('Failed to create agent', 'Close', { duration: 5000 });
        }
      });
    }
  }

  deleteAgent(agent: Agent): void {
    if (!agent.id || !confirm(`Delete agent "${agent.name}"?`)) {
      return;
    }

    this.agentService.deleteAgent(agent.id).subscribe({
      next: () => {
        this.snackBar.open('Agent deleted successfully', 'Close', { duration: 3000 });
        this.loadAgents();
      },
      error: () => {
        this.snackBar.open('Failed to delete agent', 'Close', { duration: 5000 });
      }
    });
  }

  closeForm(): void {
    this.showAddForm = false;
    this.addEditForm.reset();
    this.editingAgentId = null;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}

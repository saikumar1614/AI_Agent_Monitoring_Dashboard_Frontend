import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Execution, ExecutionLogEntry } from '../../core/models/execution.model';
import { ExecutionService } from '../../core/services/execution.service';

@Component({
  selector: 'app-execution-details',
  templateUrl: './execution-details.component.html',
  styleUrls: ['./execution-details.component.css']
})
export class ExecutionDetailsComponent implements OnInit {
  execution: Execution | null = null;
  logs: ExecutionLogEntry[] = [];
  isLoading = true;
  executionId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private executionService: ExecutionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.executionId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.executionId) {
      this.router.navigate(['/executions']);
      return;
    }

    this.loadExecution();
  }

  loadExecution(): void {
    this.isLoading = true;
    this.executionService.getExecutionById(this.executionId).subscribe({
      next: (execution) => {
        this.execution = execution;
        this.loadLogs();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load execution details', 'Close', { duration: 4000 });
        this.router.navigate(['/executions']);
      }
    });
  }

  loadLogs(): void {
    this.executionService.getExecutionLogs(this.executionId).subscribe({
      next: (entries) => {
        this.logs = entries || [];
        this.isLoading = false;
      },
      error: () => {
        this.logs = this.execution?.logs || [];
        this.isLoading = false;
      }
    });
  }

  retryExecution(): void {
    if (!this.execution) {
      return;
    }

    this.executionService.retryExecution(this.execution.id).subscribe({
      next: (updatedExecution) => {
        this.execution = updatedExecution;
        this.snackBar.open('Execution retried successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Retry failed', 'Close', { duration: 3000 });
      }
    });
  }

  cancelExecution(): void {
    if (!this.execution) {
      return;
    }

    this.executionService.cancelExecution(this.execution.id).subscribe({
      next: (updatedExecution) => {
        this.execution = updatedExecution;
        this.snackBar.open('Execution cancelled', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Cancel action failed', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/executions']);
  }

  get canRetry(): boolean {
    return this.execution?.status === 'failed' || this.execution?.status === 'cancelled';
  }

  get canCancel(): boolean {
    return this.execution?.status === 'queued' || this.execution?.status === 'running';
  }

  getStatusClass(status?: string): string {
    return status ? `status-${status}` : '';
  }

  formatDuration(durationMs?: number): string {
    if (!durationMs) {
      return '-';
    }

    if (durationMs < 1000) {
      return `${durationMs} ms`;
    }

    const seconds = durationMs / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(1)} s`;
    }

    return `${(seconds / 60).toFixed(1)} min`;
  }
}

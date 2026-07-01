import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Execution, ExecutionFilters, ExecutionListResponse, ExecutionStatus } from '../../core/models/execution.model';
import { ExecutionService } from '../../core/services/execution.service';

@Component({
  selector: 'app-execution-list',
  templateUrl: './execution-list.component.html',
  styleUrls: ['./execution-list.component.css']
})
export class ExecutionListComponent implements OnInit {
  executions: Execution[] = [];
  displayedColumns: string[] = ['id', 'agent', 'status', 'startedAt', 'duration', 'tokens', 'cost', 'actions'];
  filterForm: FormGroup;
  statusOptions: ExecutionStatus[] = ['queued', 'running', 'completed', 'failed', 'cancelled'];

  isLoading = false;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  totalCount = 0;
  currentPage = 1;

  constructor(
    private executionService: ExecutionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      agentId: [''],
      search: [''],
      fromDate: [''],
      toDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadExecutions();
  }

  loadExecutions(): void {
    this.isLoading = true;
    const filters: ExecutionFilters = this.normalizeFilters(this.filterForm.getRawValue());

    this.executionService.getExecutions(this.currentPage, this.pageSize, filters).subscribe({
      next: (response: ExecutionListResponse) => {
        this.executions = response?.data ?? [];
        this.totalCount = response?.total ?? this.executions.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load executions', 'Close', { duration: 4000 });
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadExecutions();
  }

  clearFilters(): void {
    this.filterForm.reset({
      status: '',
      agentId: '',
      search: '',
      fromDate: '',
      toDate: ''
    });
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadExecutions();
  }

  viewExecution(execution: Execution): void {
    this.router.navigate(['/executions', execution.id]);
  }

  getStatusClass(status: ExecutionStatus): string {
    return `status-${status}`;
  }

  private normalizeFilters(rawFilters: ExecutionFilters): ExecutionFilters {
    const formatDate = (value: unknown): string | undefined => {
      if (!value) {
        return undefined;
      }

      if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
      }

      return String(value);
    };

    return {
      ...rawFilters,
      fromDate: formatDate(rawFilters.fromDate),
      toDate: formatDate(rawFilters.toDate)
    };
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

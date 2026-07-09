import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Failure, FailureFilters, FailureAnalytics, FailureSeverity } from '../../core/models/failure.model';
import { FailureService } from '../../core/services/failure.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-failure-list',
  templateUrl: './failure-list.component.html',
  styleUrls: ['./failure-list.component.css']
})
export class FailureListComponent implements OnInit {
  isLoading = false;
  failures: Failure[] = [];
  analytics: FailureAnalytics | null = null;
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  filterForm: FormGroup;
  displayedColumns: string[] = ['errorType', 'agentName', 'severity', 'occurrenceCount', 'resolutionStatus', 'occurredAt', 'actions'];
  severityOptions: FailureSeverity[] = ['critical', 'high', 'medium', 'low'];

  constructor(
    private failureService: FailureService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      severity: '',
      status: '',
      agentId: '',
      errorType: '',
      search: '',
      fromDate: '',
      toDate: ''
    });
  }

  ngOnInit(): void {
    this.loadAnalytics();
    this.loadFailures();
  }

  loadAnalytics(): void {
    this.failureService.getAnalytics().subscribe({
      next: (data) => (this.analytics = data),
      error: () => this.snackBar.open('Failed to load failure analytics', 'Close', { duration: 3000 })
    });
  }

  loadFailures(): void {
    this.isLoading = true;
    const filters = this.normalizeFilters(this.filterForm.getRawValue());

    this.failureService.getFailures(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.failures = response.data;
        this.totalCount = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load failures', 'Close', { duration: 4000 });
      }
    });
  }

  onFilterApply(): void {
    this.currentPage = 1;
    this.loadFailures();
  }

  onFilterReset(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadFailures();
  }

  onPageChange(page: number): void {
    this.currentPage = page + 1;
    this.loadFailures();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadFailures();
  }

  viewDetails(failureId: string): void {
    this.router.navigate(['/failures', failureId]);
  }

  getSeverityClass(severity: string): string {
    return `severity-${severity}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  private normalizeFilters(rawFilters: FailureFilters): FailureFilters {
    const formatDate = (value: unknown): string | undefined => {
      if (!value) return undefined;
      if (value instanceof Date) return value.toISOString().slice(0, 10);
      return String(value);
    };

    return {
      ...rawFilters,
      fromDate: formatDate(rawFilters.fromDate),
      toDate: formatDate(rawFilters.toDate)
    };
  }
}

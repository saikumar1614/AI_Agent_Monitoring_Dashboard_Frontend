import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToolUsage, ToolUsageFilters } from '../../core/models/tool-usage.model';
import { ToolUsageService } from '../../core/services/tool-usage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-usage-list',
  templateUrl: './tool-usage-list.component.html',
  styleUrls: ['./tool-usage-list.component.css']
})
export class ToolUsageListComponent implements OnInit {
  isLoading = false;
  toolUsages: ToolUsage[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  filterForm: FormGroup;
  displayedColumns: string[] = ['toolName', 'category', 'agentName', 'callCount', 'successCount', 'failureCount', 'avgDurationMs', 'totalCost', 'actions'];

  constructor(
    private toolUsageService: ToolUsageService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      toolName: '',
      category: '',
      agentId: '',
      search: '',
      fromDate: '',
      toDate: ''
    });
  }

  ngOnInit(): void {
    this.loadToolUsages();
  }

  loadToolUsages(): void {
    this.isLoading = true;
    const filters = this.normalizeFilters(this.filterForm.getRawValue());

    this.toolUsageService.getToolUsages(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.toolUsages = response.data;
        this.totalCount = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load tool usage data', 'Close', { duration: 4000 });
      }
    });
  }

  onFilterApply(): void {
    this.currentPage = 1;
    this.loadToolUsages();
  }

  onFilterReset(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadToolUsages();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadToolUsages();
  }

  viewDetails(toolId: string): void {
    this.router.navigate(['/tool-usage', toolId]);
  }

  private normalizeFilters(rawFilters: ToolUsageFilters): ToolUsageFilters {
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

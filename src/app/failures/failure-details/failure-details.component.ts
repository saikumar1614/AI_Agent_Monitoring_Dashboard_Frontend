import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Failure } from '../../core/models/failure.model';
import { FailureService } from '../../core/services/failure.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-failure-details',
  templateUrl: './failure-details.component.html',
  styleUrls: ['./failure-details.component.css']
})
export class FailureDetailsComponent implements OnInit {
  failure: Failure | null = null;
  isLoading = true;
  resolutionForm: FormGroup;
  expandedStackFrames: Set<number> = new Set();
  failureId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private failureService: FailureService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.resolutionForm = this.fb.group({
      status: 'unresolved',
      notes: ''
    });
  }

  ngOnInit(): void {
    this.failureId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.failureId) {
      this.router.navigate(['/failures']);
      return;
    }
    this.loadFailure();
  }

  loadFailure(): void {
    this.isLoading = true;
    this.failureService.getFailureById(this.failureId).subscribe({
      next: (failure) => {
        this.failure = failure;
        this.resolutionForm.patchValue({ status: failure.resolutionStatus });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load failure details', 'Close', { duration: 4000 });
        this.router.navigate(['/failures']);
      }
    });
  }

  toggleStackFrame(index: number): void {
    if (this.expandedStackFrames.has(index)) {
      this.expandedStackFrames.delete(index);
    } else {
      this.expandedStackFrames.add(index);
    }
  }

  isStackFrameExpanded(index: number): boolean {
    return this.expandedStackFrames.has(index);
  }

  saveResolution(): void {
    if (!this.failure) return;

    const { status, notes } = this.resolutionForm.value;
    this.failureService.updateResolution(this.failure.id, status, notes).subscribe({
      next: () => {
        this.snackBar.open('Failure resolution updated', 'Close', { duration: 3000 });
        this.loadFailure();
      },
      error: () => this.snackBar.open('Failed to update resolution', 'Close', { duration: 4000 })
    });
  }

  goBack(): void {
    this.router.navigate(['/failures']);
  }

  getSeverityClass(): string {
    return this.failure ? `severity-${this.failure.severity}` : '';
  }

  getStatusClass(): string {
    return this.failure ? `status-${this.failure.resolutionStatus}` : '';
  }
}

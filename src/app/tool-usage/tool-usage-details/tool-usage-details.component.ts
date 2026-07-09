import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolUsage } from '../../core/models/tool-usage.model';
import { ToolUsageService } from '../../core/services/tool-usage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tool-usage-details',
  templateUrl: './tool-usage-details.component.html',
  styleUrls: ['./tool-usage-details.component.css']
})
export class ToolUsageDetailsComponent implements OnInit {
  toolUsage: ToolUsage | null = null;
  isLoading = true;
  toolId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolUsageService: ToolUsageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.toolId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.toolId) {
      this.router.navigate(['/tool-usage']);
      return;
    }
    this.loadToolUsage();
  }

  loadToolUsage(): void {
    this.isLoading = true;
    this.toolUsageService.getToolUsageById(this.toolId).subscribe({
      next: (data) => {
        this.toolUsage = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load tool usage details', 'Close', { duration: 4000 });
        this.router.navigate(['/tool-usage']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tool-usage']);
  }

  getSuccessRate(): number {
    if (!this.toolUsage || this.toolUsage.callCount === 0) return 0;
    return (this.toolUsage.successCount / this.toolUsage.callCount) * 100;
  }
}


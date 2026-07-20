import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  @Input() columns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() rowClick = new EventEmitter<any>();

  onPageChange(event: any): void {
    this.pageChange.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }
}

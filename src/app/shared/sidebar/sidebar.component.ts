import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TokenStorage } from '../../core/utils/token-storage';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  sidebarOpen: boolean = true;
  agentCount: number = 24;
  failureCount: number = 3;

  constructor(private tokenStorage: TokenStorage) {}

  ngOnInit(): void {
    // Load sidebar state from storage
    this.sidebarOpen = this.tokenStorage.getSidebarState();
  }

  onSidebarOpenedChange(opened: boolean): void {
    this.sidebarOpen = opened;
    this.tokenStorage.setSidebarState(opened);
  }

  toggle(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}

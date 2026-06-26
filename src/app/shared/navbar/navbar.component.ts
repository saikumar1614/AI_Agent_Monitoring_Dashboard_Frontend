import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorage } from '../../core/utils/token-storage';

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  userName: string = 'User';
  isDarkMode: boolean = false;
  notificationCount: number = 3;
  recentNotifications: Notification[] = [
    {
      id: 1,
      message: 'Agent Alpha completed 5 executions',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      message: 'High failure rate detected on Agent Beta',
      time: '15 min ago',
      read: false
    },
    {
      id: 3,
      message: 'Daily report is ready',
      time: '1 hour ago',
      read: true
    }
  ];

  constructor(
    private router: Router,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadThemePreference();
  }

  loadUserInfo(): void {
    const user = this.tokenStorage.getUserInfo();
    if (user) {
      this.userName = user.name || user.email || 'User';
    }
  }

  loadThemePreference(): void {
    const theme = this.tokenStorage.getThemePreference();
    this.isDarkMode = theme === 'dark';
  }

  onSearch(event: any): void {
    const query = event.target.value;
    if (query.length > 0) {
      // Implement search functionality
      console.log('Search query:', query);
    }
  }

  setTheme(theme: string): void {
    this.isDarkMode = theme === 'dark';
    this.tokenStorage.setThemePreference(theme);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }

  logout(): void {
    this.tokenStorage.clearAll();
    this.router.navigate(['/auth/login']);
  }

  toggleSidebarMenu(): void {
    this.toggleSidebar.emit();
  }
}

import { Injectable } from '@angular/core';
import { AUTH_CONSTANTS, STORAGE_KEYS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
  
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  
  removeAccessToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
  
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  
  removeRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  
  setUserInfo(user: any): void {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(user));
  }
  
  getUserInfo(): any {
    const user = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return user ? JSON.parse(user) : null;
  }
  
  removeUserInfo(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  }
  
  setThemePreference(theme: string): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
  
  getThemePreference(): string | null {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  }
  
  setSidebarState(state: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(state));
  }
  
  getSidebarState(): boolean {
    const state = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
    return state ? JSON.parse(state) : true;
  }
  
  clearAll(): void {
    localStorage.clear();
  }
  
  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) {
      return true;
    }
    
    try {
      // Decode JWT token
      const parts = tokenToCheck.split('.');
      if (parts.length !== 3) {
        return true;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const expiryTime = payload.exp * 1000;
      
      return Date.now() >= expiryTime;
    } catch (error) {
      return true;
    }
  }
  
  getTokenExpiryTime(): number | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000;
    } catch (error) {
      return null;
    }
  }
}

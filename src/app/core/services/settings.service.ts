import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserSettings(): Observable<any> {
    return this.http.get(${this.base}${environment.endpoints.settings.user});
  }

  updateUserSettings(payload: any): Observable<any> {
    return this.http.put(${this.base}${environment.endpoints.settings.user}, payload);
  }

  getPreferences(): Observable<any> {
    return this.http.get(${this.base}${environment.endpoints.settings.preferences});
  }

  updatePreferences(payload: any): Observable<any> {
    return this.http.put(${this.base}${environment.endpoints.settings.preferences}, payload);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenStorage } from '../utils/token-storage';

export interface LoginPayload {
	email: string;
	password: string;
}

export interface SignupPayload {
	name: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken?: string;
	user: {
		id?: string;
		name?: string;
		email: string;
	};
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly baseUrl = environment.apiUrl;

	constructor(
		private http: HttpClient,
		private router: Router,
		private tokenStorage: TokenStorage
	) {}

	login(payload: LoginPayload): Observable<AuthResponse> {
		const url = `${this.baseUrl}${environment.endpoints.auth.login}`;
		return this.http.post<AuthResponse>(url, payload).pipe(
			tap((response) => this.persistSession(response))
		);
	}

	signup(payload: SignupPayload): Observable<AuthResponse> {
		const url = `${this.baseUrl}${environment.endpoints.auth.signup}`;
		return this.http.post<AuthResponse>(url, payload).pipe(
			tap((response) => this.persistSession(response))
		);
	}

	logout(redirectToLogin: boolean = true): void {
		this.tokenStorage.clearAll();
		if (redirectToLogin) {
			this.router.navigate(['/auth/login']);
		}
	}

	isAuthenticated(): boolean {
		const token = this.tokenStorage.getAccessToken();
		if (!token) {
			return false;
		}
		return !this.tokenStorage.isTokenExpired(token);
	}

	getAccessToken(): string | null {
		return this.tokenStorage.getAccessToken();
	}

	private persistSession(response: AuthResponse): void {
		this.tokenStorage.setAccessToken(response.accessToken);
		if (response.refreshToken) {
			this.tokenStorage.setRefreshToken(response.refreshToken);
		}
		this.tokenStorage.setUserInfo(response.user);
	}
}

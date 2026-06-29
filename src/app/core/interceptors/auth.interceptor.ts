import { Injectable } from '@angular/core';
import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private readonly bypassAuthPaths = ['/auth/login', '/auth/signup'];

	constructor(private authService: AuthService) {}

	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const shouldBypass = this.bypassAuthPaths.some((path) => req.url.includes(path));
		const token = this.authService.getAccessToken();

		let request = req;
		if (!shouldBypass && token) {
			request = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401 && !shouldBypass) {
					this.authService.logout();
				}
				return throwError(() => error);
			})
		);
	}
}

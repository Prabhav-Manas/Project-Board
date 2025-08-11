import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { environment } from 'environments/environment';
import { environment } from 'environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private token: string = '';
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private authInformation: any = '';

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _toastrService: ToastrService
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Signup
  signup(email: string, password: string, image: File) {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    return this.http.post<any>(`${this.baseUrl}/users/signup`, formData);
  }

  // Signin
  signin(email: string, password: string) {
    return this.http
      .post<{ token: string; expiresIn: number }>(
        `${this.baseUrl}/users/signin`,
        { email, password }
      )
      .pipe(
        tap((res: any) => {
          this.token = res.token;
          if (this.token) {
            const expiresInDuration = res.expiresIn;
            this.setAuthTimeOut(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(this.token, expirationDate);
          }
          this.router.navigate(['/app-dashboard']);
        })
      );
  }

  // autoSignIn
  autoAuthData() {
    this.authInformation = this.getAuthData();
    if (!this.authInformation) {
      return;
    }

    const expirationDate = this.authInformation.expirationDate;
    if (!expirationDate) {
      return;
    }

    const now = new Date();
    const expiresIn = expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = this.authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimeOut(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  // Logout
  onLogout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  // Set Auth TimeOut
  private setAuthTimeOut(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.onLogout();
    }, duration * 1000);
  }

  // ============================ LocalStorage ============================
  // Save Auth Data
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  // Clear Auth Data
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  // Get Auth Data
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) {
      return null;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  // Forgot-Password
  forgotPassword(email: string) {
    return this.http.post<any>(
      `${this.baseUrl}/users/forgot-password`,
      {
        email: email,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Reset-Password
  resetPassword(token: string, newPassword: string) {
    return this.http.post<any>(
      `${this.baseUrl}/users/reset-password/${token}`,
      {
        newPassword: newPassword,
      }
    );
  }
}

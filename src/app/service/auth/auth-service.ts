import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_API = environment.authApiUrl;
  private readonly TOKEN_KEY = 'auth-token';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  isLoaded$ = this.isLoadedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.AUTH_API}/api/auth/login`, {
      username: credentials.username,
      password: credentials.password
    }).pipe(
      tap((response) => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.fetchCurrentUser();
        }
      }),
    );
  }

  private saveToken(token: string): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
    window.localStorage.setItem(this.TOKEN_KEY, token)
  }

  public getToken(): string | null {
    return window.localStorage.getItem(this.TOKEN_KEY)
  }

  fetchCurrentUser(): void {
    this.http.get(`${this.AUTH_API}/api/auth/user/current`).subscribe({
      next: (user) => {
        this.userSubject.next(user);
        this.isLoadedSubject.next(true);
      },
      error: () => {
        this.logout();
      }
    });
  }

  logout(): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
    this.userSubject.next(null);
    this.isLoadedSubject.next(true)
    this.router.navigate(['login'])
  }

  checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.fetchCurrentUser();
    } else {
      this.userSubject.next(null);
      this.isLoadedSubject.next(true);
    }
  }
}
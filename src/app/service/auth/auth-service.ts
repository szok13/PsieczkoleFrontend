import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth/';
  private readonly TOKEN_KEY = 'auth-token';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  isLoaded$ = this.isLoadedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.API_URL + 'login', {
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
    this.http.get(this.API_URL + 'user/current').subscribe({
      next: (user) => {
        this.userSubject.next(user);
        this.isLoadedSubject.next(true); // Sukces - dane są, kończymy ładowanie
      },
      error: () => {
        this.logout(); // Czyści token i ustawia isLoaded na true
      }
    });
  }

  logout(): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
    this.userSubject.next(null);
    this.isLoadedSubject.next(true)
    this.router.navigate(['login'])
  }

  // auth-service.ts

  checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      // Jeśli jest token, isLoaded będzie true dopiero gdy serwer odpowie
      this.fetchCurrentUser();
    } else {
      // Jeśli nie ma tokena, od razu mówimy, że załadowano (użytkownik jest gościem)
      this.userSubject.next(null);
      this.isLoadedSubject.next(true);
    }
  }
}
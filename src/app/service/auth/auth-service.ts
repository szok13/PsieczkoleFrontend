import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  isLoaded$ = this.isLoadedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    const body = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post('http://localhost:8080/api/auth/login', body.toString(), {
      headers,
      withCredentials: true
    }).pipe(
      tap(() => this.fetchCurrentUser()),
      switchMap(() => this.user$.pipe(
        filter(user => user !== null),
        take(1),
        timeout(5000),
        catchError(() => of(null))
      ))
    );
  }

  fetchCurrentUser(): void {
    this.http.get('http://localhost:8080/api/auth/user/current', { withCredentials: true })
      .subscribe({
        next: (user) => this.userSubject.next(user),
        error: () => this.userSubject.next(null)
      });
  }

  logout(): void {
    this.http.post('http://localhost:8080/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.userSubject.next(null);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed', err);
          this.userSubject.next(null);
          this.router.navigate(['/login']);
        }
      });
  }

  checkAuthStatus(): void {
    this.http.get('http://localhost:8080/api/auth/user/current', { withCredentials: true })
      .pipe(
        take(1),
        catchError(() => of(null))
      )
      .subscribe(user => {
        this.userSubject.next(user);
        this.isLoadedSubject.next(true);
      });
  }
}
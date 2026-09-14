import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('user_role', response.role);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/api/auth/users');
  }
}

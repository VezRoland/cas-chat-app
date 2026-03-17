import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { SignInBody, SignUpBody, User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';

  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  signin(credentials: SignInBody) {
    return this.http
      .post<User>(`${this.apiUrl}/auth/signin`, credentials, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  signup(credentials: SignUpBody) {
    return this.http.post(`${this.apiUrl}/auth/signup`, credentials, { withCredentials: true });
  }

  signout() {
    return this.http
      .post(`${this.apiUrl}/auth/signout`, null, { withCredentials: true })
      .pipe(tap(() => this.currentUser.set(null)));
  }

  getUser() {
    return this.http
      .get<User>(`${this.apiUrl}/users/me`, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }
}

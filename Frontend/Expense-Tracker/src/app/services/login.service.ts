import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Defines the structure of the response received from the login API
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5000/api/v1/login'; // Base URL for the backend API

  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: { username: string, email: string, password: string, confirmPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}  
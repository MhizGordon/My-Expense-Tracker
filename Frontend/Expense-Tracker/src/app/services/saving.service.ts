import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Saving {
  month: string;
  amount: number;
}

@Injectable({
  providedIn: 'root', // Makes the service available app-wide
})
export class SavingService {
  private baseUrl = 'http://localhost:5000/api/v1'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all saved savings from the backend
  getSavings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-savings`);
  }

  // Add new savings to the backend
  addSaving(saving: { month: string; amount: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-savings`, saving);
  }
}

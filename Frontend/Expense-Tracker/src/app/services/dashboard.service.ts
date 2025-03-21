import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/v1'; // Your API base URL

  constructor(private http: HttpClient) {}

  getIncomeData(months: number): Observable<{ date: string; month: string; amount: number }[]> {
    return this.http
      .get<{ data: { date: string; month: string; amount: number }[] }>(
        `${this.apiUrl}/get-incomes?months=${months}`
      )
      .pipe(map(response => response.data)); // Extract 'data' from the response
  }
  
  

  getExpenses(months: number): Observable<{ date: string; month: string; expenseAmount: number }[]> {
    return this.http.get<{ data: { date: string; month: string; expenseAmount: number }[] }>(
      `${this.apiUrl}/get-expenses?months=${months}`
    ).pipe(map(response => response.data)); // Extract 'data' from the response
  }
  
  
  getSavingsData(months: number): Observable<{ month: string; amount: number }[]> {
    return this.http.get<{ month: string; amount: number }[]>(
      `${this.apiUrl}/get-savings?months=${months}`
    );
  }  
  
}

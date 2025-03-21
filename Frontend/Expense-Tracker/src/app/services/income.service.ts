import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) { }

  getIncomes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-incomes`);
  }

  addIncome(IncomeData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-incomes`,IncomeData);
  }
}

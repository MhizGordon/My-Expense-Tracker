import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) {}

  getIncomes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-incomes`);
  }
getExpenses(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/get-expenses`);
}

}

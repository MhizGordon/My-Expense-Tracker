import { HttpClient } from '@angular/common/http'; // Imports HttpClient to handle HTTP requests
import { Injectable } from '@angular/core'; // Marks the service as injectable
import { Observable } from 'rxjs'; // Imports Observable to handle asynchronous data

@Injectable({
  providedIn: 'root', // Makes this service available throughout the application
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5000/api/v1'; // Base URL for the backend API

  constructor(private http: HttpClient) {} // Injects HttpClient to make HTTP requests

  // Fetches all expenses from the backend
  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-expenses`);
  }

  // Sends a new expense to be added to the backend
  addExpense(expenseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-expenses`, expenseData);
  }
}

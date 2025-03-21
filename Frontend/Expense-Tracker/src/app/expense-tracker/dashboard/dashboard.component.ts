// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, SidebarComponent, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Will hold the monthly expense data for the past 3 months.
  lastThreeMonthsExpense: { month: string; expenseAmount: number }[] = [];
  lastThreeMonthsIncome: { month: string; amount: number }[] = [];
  lastThreeMonthsSavings: { month: string; amount: number }[] = [];

  currentMonthExpense: number = 0;
  currentMonthIncome: number = 0;
  currentMonthSavings: number = 0;
  
  // An aggregated total of the past 3 months (optional)
  totalExpensesPast3Months = 0;
  totalIncomesPast3Months = 0;
  totalSavingsPast3Months = 0;

  constructor(
    public router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadExpenseData();
    this.loadIncomeData();
    this.loadSavingsData();
  }

  private loadExpenseData(): void {
    this.dashboardService.getExpenses(3).subscribe({
      next: (data) => {
        // Assuming data is sorted from oldest to newest
        const lastThreeEntries = data.slice(-3);
        this.lastThreeMonthsExpense = lastThreeEntries;
        this.totalExpensesPast3Months = lastThreeEntries.reduce(
          (total, expense) => total + expense.expenseAmount,
          0
        );
  
        // Find the current month's record
        const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
        const currentRecord = data.find(expense => expense.month === currentMonthName);
        this.currentMonthExpense = currentRecord ? currentRecord.expenseAmount : 0;
      },
      error: (err) => console.error('Error fetching expense data:', err)
    });
  }
  

  private loadIncomeData(): void {
    this.dashboardService.getIncomeData(3).subscribe({
      next: (data) => {
        // Assuming data is sorted from oldest to newest
        const lastThreeEntries = data.slice(-3); // Extract the last three months
        this.lastThreeMonthsIncome = lastThreeEntries;
        this.totalIncomesPast3Months = lastThreeEntries.reduce(
          (total, income) => total + income.amount,
          0
        );
  
        // Find the current month's record
        const currentMonthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date());
        const currentRecord = data.find(income => income.month === currentMonthName);
        this.currentMonthIncome = currentRecord ? currentRecord.amount : 0;
      },
      error: (err) => console.error("Error fetching income data:", err)
    });
  }
  

  private loadSavingsData(): void {
    // Pass 3 to get data for the past 3 months.
    this.dashboardService.getSavingsData(3).subscribe({
      next: (data) => {
        const lastThreeEntries = data.slice(-3);
      
      this.lastThreeMonthsSavings = lastThreeEntries;
      this.totalSavingsPast3Months = lastThreeEntries.reduce(
        (total, monthData) => total + monthData.amount,
        0
      );
  
        // Extract current month savings from returned data
        const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
        const currentRecord = data.find(record => record.month === currentMonthName);
        this.currentMonthSavings = currentRecord ? currentRecord.amount : 0;
      },
      error: (err) => console.error('Error fetching savings data:', err)
    });
  }
  

  // Navigation methods
  onIncome() {
    this.router.navigate(['/expense-tracker/income']);
  }

  onExpense() {
    this.router.navigate(['/expense-tracker/expense']);
  }

  onSavings() {
    this.router.navigate(['/expense-tracker/savings']);
  }
}

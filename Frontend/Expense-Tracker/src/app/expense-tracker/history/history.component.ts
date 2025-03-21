import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncomeService } from '../../services/income.service';
import { ExpenseService } from '../../services/expense.service';
import { HistoryService } from '../../services/history.service';
import { Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [IncomeService, ExpenseService]
})
export class HistoryComponent implements OnInit, AfterViewInit {
  // List of months for the month selector
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Data arrays for incomes, expenses and the combined filtered list
  incomes: any[] = [];
  expenses: any[] = [];
  filteredTransactions: any[] = [];
  
  // Default to the current month
  selectedMonth: string = new Date().toLocaleString('default', { month: 'long' });
  
  // Totals for the current month (income and expenses)
  totalIncome = 0;
  totalExpenses = 0;
  
  // Chart instance
  transactionChart: Chart | undefined;
  
  // Categories mapping for creating pie chart segments
  categories: { [key: string]: number } = {};

  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private historyService: HistoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch incomes and expenses from the backend and then filter them by month
    this.fetchTransactions();
  }

  ngAfterViewInit(): void {
    // After view initialization, render the chart
    // (Render is also triggered in onMonthChange() after data processing.)
    this.renderChart();
  }

  // Fetch incomes first, then expenses; after both, filter transactions to match the selected month.
  fetchTransactions(): void {
    this.incomeService.getIncomes().subscribe({
      next: (incomesResponse) => {
        console.log("Fetched incomes:", incomesResponse);
        // Adjust this if your backend response wraps the array (e.g., in a data property)
        this.incomes = Array.isArray(incomesResponse) ? incomesResponse : (incomesResponse.data || []);
        
        // Now fetch expenses
        this.expenseService.getExpenses().subscribe({
          next: (expensesResponse: any) => {
            console.log("Fetched expenses:", expensesResponse);
            this.expenses = Array.isArray(expensesResponse) ? expensesResponse : (expensesResponse?.data || []);
            // After both data sets are available, filter the transactions for the selected month.
            this.onMonthChange();
          },
          error: (error) => {
            console.error("Error fetching expenses:", error);
          }
        });
      },
      error: (error) => {
        console.error("Error fetching incomes:", error);
      }
    });
  }

  // Filter incomes and expenses based on the selected month.
  onMonthChange(): void {
    const selectedMonthIndex = this.months.indexOf(this.selectedMonth);

    const filteredIncomes = this.incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === selectedMonthIndex;
    });

    const filteredExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === selectedMonthIndex;
    });

    // Combine incomes and expenses
    this.filteredTransactions = [...filteredIncomes, ...filteredExpenses];
    // Remove duplicate transactions if necessary
    this.filteredTransactions = this.removeDuplicates(this.filteredTransactions);

    // Recalculate totals and categories for the chart
    this.calculateTotals();
    this.calculateCategories();
    // Re-render the pie chart with the new data set
    this.renderChart();
  }

  // Remove duplicate transactions based on date, type, and amount.
  removeDuplicates(transactions: any[]): any[] {
    return transactions.reduce((acc: any[], current) => {
      const duplicate = acc.find((item: any) =>
        item.date === current.date &&
        ((item.source && current.source && item.source === current.source) ||
         (item.expenseType && current.expenseType && item.expenseType === current.expenseType)) &&
        ((item.amount && current.amount && item.amount === current.amount) ||
         (item.expenseAmount && current.expenseAmount && item.expenseAmount === current.expenseAmount))
      );
      if (!duplicate) {
        acc.push(current);
      }
      return acc;
    }, []);
  }

  // Calculate total income and expenses from the filtered transactions.
  calculateTotals(): void {
    this.totalIncome = this.filteredTransactions
      .filter(transaction => transaction.source)
      .reduce((sum, income) => sum + Number(income.amount), 0);

    this.totalExpenses = this.filteredTransactions
      .filter(transaction => transaction.expenseType)
      .reduce((sum, expense) => sum + Number(expense.expenseAmount), 0);
  }

  // Group transaction amounts by their categories for the pie chart.
  calculateCategories(): void {
    this.categories = {};

    // Group incomes by their source.
    this.filteredTransactions
      .filter(transaction => transaction.source)
      .forEach(income => {
        const category = income.source;
        this.categories[category] = (this.categories[category] || 0) + Number(income.amount);
      });

    // Group expenses by their type.
    this.filteredTransactions
      .filter(transaction => transaction.expenseType)
      .forEach(expense => {
        const category = expense.expenseType;
        this.categories[category] = (this.categories[category] || 0) + Number(expense.expenseAmount);
      });
  }

  // Render a pie chart using Chart.js with data from the categories mapping.
  renderChart(): void {
    // Use document.getElementById to grab the canvas element directly.
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element is not available.');
      return;
    }

    // If an existing chart instance exists, destroy it before creating a new one.
    if (this.transactionChart) {
      this.transactionChart.destroy();
    }

    // Create the chart using the canvas element.
    this.transactionChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: Object.keys(this.categories),
        datasets: [{
          data: Object.values(this.categories),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#FFA726',
            '#29B6F6', '#AB47BC', '#FF7043', '#8D6E63', '#42A5F5'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Income and Expenses by Category'
          }
        }
      }
    });
  }

  // Navigate back to the dashboard.
  onBack(): void {
    this.router.navigate(['/expense-tracker/dashboard']);
  }
}

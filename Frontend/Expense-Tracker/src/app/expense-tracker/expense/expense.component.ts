import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ExpenseService } from '../../services/expense.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatIconModule, MatCardModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'] 
})
export class ExpenseComponent {
  expenseForm: any; // Form for capturing expense details
  expenses: any[] = []; // Stores all expense records
  filteredExpenses: any[] = []; // Stores expenses filtered by the selected month
  selectedMonth: string; // Tracks the currently selected month for filtering
  monthSelected: boolean = true; // Indicates if a month has been selected

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private expenseService: ExpenseService
  ) {
    // Set the selected month to the current month by default
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.loadExpenses(); // Load existing expenses from the backend
    this.expenseForm = this.fb.group({
      month: [this.selectedMonth, Validators.required], // Pre-fill month field
      date: ['', Validators.required], // Date of the expense
      expenseType: ['', Validators.required], // Category/type of expense
      expenseAmount: ['', Validators.required], // Amount spent
    });
  }

  // Fetch expenses from the backend service
  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe((response: any) => {
      this.expenses = response.data; 
      this.filterExpenses(); // Filter expenses based on selected month
    });
  }

  // Handle month selection change
  onChangeExpense(event: any): void {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.filterExpenses();
  }

  // Filter expenses based on the selected month
  filterExpenses(): void {
    this.filteredExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.toLocaleString('default', { month: 'long' }) === this.selectedMonth;
    });
  }

  // Calculate the total expense for the selected month
  calculateTotalExpense(): number {
    if (!this.filteredExpenses || this.filteredExpenses.length === 0) {
      return 0;
    }
    return this.filteredExpenses.reduce(
      (total, expense) => total + Number(expense.expenseAmount), 0);
  }

  // Get filtered expenses for display
  getFilteredExpenses() {
    return this.expenses.filter(expense =>
      new Date(expense.date).toLocaleString('default', { month: 'long' }) === this.selectedMonth
    );
  }

  // Handle form submission to add a new expense
  onSubmitExpense(): void {
    const formValue = this.expenseForm.value;    
    if (this.expenseForm.valid) {
      const newExpense = { ...formValue }; // Copy form data
      this.expenseService.addExpense(newExpense).subscribe(
        (response: { data: any }) => {
          console.log('Expense added successfully:', response);
          this.expenses.push(response.data); // Add new expense to the list
          this.filterExpenses(); // Refresh the displayed expenses
          this.expenseForm.reset({ month: this.selectedMonth }); // Reset form after submission
        },
        (error: any) => {
          console.error('Error adding expense:', error);
        }
      );
    } else {
      console.error('Form is invalid. Errors:', this.expenseForm.errors);
    }
  }

  // Placeholder function for saving the form (can be expanded later)
  saveForm(): void {
    console.log('Form saved!');
  }

  // Navigate back to the dashboard
  onBack(): void {
    this.router.navigate(['/expense-tracker/dashboard']);
  }

  // Reset form and refresh expenses when saved
  onSave() {
    if (this.expenseForm.valid) {
      this.expenseForm.reset({ month: this.selectedMonth });
      this.getFilteredExpenses();
    }
  }
}

import { CommonModule } from '@angular/common'; 
import {ChangeDetectionStrategy, Component } from '@angular/core'; 
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import {MatInputModule} from '@angular/material/input'; 
import { MatIconModule } from '@angular/material/icon'; 
import { Router } from '@angular/router'; 
import {MatCardModule} from '@angular/material/card'; 
import { IncomeService } from '../../services/income.service'; 
import { HttpClientModule } from '@angular/common/http';

@Component({ 
  selector: 'app-income', 
  standalone:true, 
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatIconModule, MatCardModule, HttpClientModule, FormsModule], 
  changeDetection: ChangeDetectionStrategy.OnPush, 
  templateUrl: './income.component.html', 
  styleUrls: ['./income.component.scss' ]
})

export class IncomeComponent { 
  incomeForm: any; // Form for capturing income details
  incomes: any[] = []; // Stores all income records
  filteredIncomes: any[] = []; // Stores incomes filtered by the selected month
  selectedMonth: string; // Tracks the currently selected month for filtering

  monthSelected: boolean= true; // Indicates if a month has been selected

  constructor( 
    public fb: FormBuilder, 
    private router: Router, 
    private incomeService: IncomeService 
  ) { 
    const currentDate = new Date();  // Set the selected month to the current month by default
    this.selectedMonth = currentDate.toLocaleString('default', {month: 'long'}); 
    }
    ngOnInit(): void { 
      this.loadIncomes();  // Load existing incomes from the backend
      this.incomeForm = this.fb.group ( { 
        month: [this.selectedMonth, Validators.required], // Pre-fill month field
        date: ['', Validators.required], // Date of the income
        source: ['', Validators.required], // source of the income
        amount: ['', Validators.required], // Amount received
      }); 
    }

     // Fetch incomes from the backend service
    loadIncomes(): void { 
      this.incomeService.getIncomes().subscribe((response: any) => { 
        this.incomes = response.data; 
        this.filterIncomes();  // Filter expenses based on selected month
      }); 
    }

     // Filter incomes based on the selected month
  filterIncomes(): void { 
    this.filteredIncomes = this.incomes.filter(income => { 
      const incomeDate = new Date(income.date); 
      return incomeDate.toLocaleString('default', { month: 'long' }) === this.selectedMonth; 
    }); 
  }

    // Handle month selection change
    onChange(event: any): void { 
      this.selectedMonth = event.target.value; 
      this.monthSelected = true; 
      this.filterIncomes(); 
    }

    // Calculate the total income for the selected month
    calculateTotalIncome(): number { 
      if (!this.filteredIncomes || this.filteredIncomes.length === 0) { 
        return 0; 
      } 
      return this.filteredIncomes.reduce(
        (total, income) => total + Number(income.amount), 0); 
    }

    // Get filtered incomes for display
    getFilteredIncomes() { 
      return this.incomes.filter(income => 
        new Date(income.date).toLocaleString('default', { month: 'long' }) === this.selectedMonth 
      ); 
    }

    // Handle form submission to add a new income
    onSubmit(): void { 
      const formValue = this.incomeForm.value;
      if (this.incomeForm.valid) { 
        const newIncome = { ...formValue }; 
        this.incomeService.addIncome(newIncome).subscribe( 
          (response: { data: any }) => {
            console.log('Income added successfully:', response); 
            this.incomes.push(response.data); // Add the new income to the incomes list
              this.filterIncomes();  // Refresh the displayed incomes
              this.incomeForm.reset();  // Reset form after submission
            }, 
            (error: any) => { 
              console.error('Error adding income:', error); 
            } 
          ); 
            } else { 
              console.error('Form is invalid'); 
            } 
     }

      // Placeholder function for saving the form
     saveForm() { 
      console.log("Form saved!"); 
    } 
    
     // Navigate back to the dashboard
    onBack() { 
      this.router.navigate(['/expense-tracker/dashboard']); 
    } 
    
    // Reset form and refresh expenses when saved
    onSave() { 
      if (this.incomeForm.valid) { 
        this.incomeForm.reset({ month: this.selectedMonth }); 
        this.getFilteredIncomes(); 
      } 
    }

}


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { HistoryComponent } from './history/history.component';
import { SavingsComponent } from './savings/savings.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'sidebar', component:SidebarComponent},
  {path: 'dashboard', component:DashboardComponent},
  {path: 'income', component:IncomeComponent},
  {path: 'expense', component:ExpenseComponent},
  {path: 'history', component:HistoryComponent},
  {path: 'savings', component:SavingsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseTrackerRoutingModule { }

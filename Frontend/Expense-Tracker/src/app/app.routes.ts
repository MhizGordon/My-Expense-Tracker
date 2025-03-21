import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'expense-tracker', loadChildren:()=> import('./expense-tracker/expense-tracker.module').then(m=>m.ExpenseTrackerModule)}
];

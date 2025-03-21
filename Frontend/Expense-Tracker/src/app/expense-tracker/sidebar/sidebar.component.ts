import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar', 
  standalone: true,
  imports: [MatIconModule], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss' ]
})

export class SidebarComponent {
  isSlideOut = true; // Controls the visibility of the slide-out panel

  constructor(private router: Router) { } // Injects the Router service for navigation

  // Toggles the slide-out panel visibility
  toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }

  // Navigates to the Dashboard page
  onDash() {
    this.router.navigate(['/expense-tracker/dashboard']);
  }

  // Navigates to the History page
  onHistory() {
    this.router.navigate(['/expense-tracker/history']);
  }

  // Logs out and navigates to the Login page
  onLogout() {
    this.router.navigate(['/expense-tracker/login']);
  }
}

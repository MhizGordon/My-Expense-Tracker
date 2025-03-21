import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: any; // Form for login input fields
  registerForm: any; // Form for user registration input fields
  activeForm: 'login' | 'register' = 'login'; // Controls which form is currently active

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // Initialize login form with validation rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email is required and must be a valid email format
      password: ['', Validators.required] // Password is required
    });

    // Initialize registration form with validation rules
    this.registerForm = this.fb.group({
      username: ['', Validators.required], // Username is required
      email: ['', [Validators.required, Validators.email]], // Email is required and must be valid
      password: ['', Validators.required], // Password is required
      confirmPassword: ['', Validators.required] // Confirm password field is required
    });
  }

  // Toggle between login and register forms
  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
  }

  // Handles user login
  login() {
    if (this.loginForm.valid) {
      console.log("Login info => ", this.loginForm.value);
      this.router.navigate(['/expense-tracker/dashboard']); // Redirect to dashboard after login
    } else {
      this.snackBar.open('Invalid email or password', 'Close', { duration: 3000 }); // Show error message
    }
  }

  // Handles user registration
  register() {
    if (this.registerForm.valid) {
      console.log("Register info => ", this.registerForm.value);
      
      // Simulates a successful registration and refreshes the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      // Redirect to login page after registration
      this.router.navigate(['/expense-tracker/login']);
    } else {
      this.snackBar.open('Please fill in all fields correctly', 'Close', { duration: 3000 }); // Show error message
      
      // Handle login after registration (possible misplaced logic)
      if (this.loginForm.valid) {
        this.loginService.login(this.loginForm.value).subscribe({
          next: (response) => {
            // Store the token and navigate to the dashboard
            this.loginService.setToken(response.token);
            this.router.navigate(['/expense-tracker/dashboard']);
          },
          error: (err) => {
            // Show login error message
            this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-user',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-user.html',
  styleUrl: './register-user.css',
})
export class RegisterUser {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: ''
  };
  
  confirmPassword = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    if (this.registerData.password !== this.confirmPassword) {
      this.error = "Passwords must match.";
      return;
    }

    this.http.post('http://localhost:8080/api/auth/register', this.registerData)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          this.error = 'Registration failed. Email might already be in use.';
        }
      });
  }
}
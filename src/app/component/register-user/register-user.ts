import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ConfigService } from '../../service/config/config-service';

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

  constructor(private http: HttpClient, private router: Router, private config: ConfigService) { }

  onRegister() {
    if (this.registerData.password !== this.confirmPassword) {
      this.error = "Passwords must match.";
      return;
    }

    this.http.post(`${this.config.authApiUrl}/api/auth/register`, this.registerData)
      .subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed. Email might already be in use.';
        }
      });
  }
}
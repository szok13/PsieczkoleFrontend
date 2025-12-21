import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  login() {
    this.authService.login({ username: this.username, password: this.password})
      .subscribe({
        next: () => {
          console.log('Login successful, navigating...');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.error = 'Invalid username or password';
          this.cdr.detectChanges();
        }
      });
  }
}

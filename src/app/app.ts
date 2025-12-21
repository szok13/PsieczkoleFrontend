import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from './service/auth/auth-service';
import { RouterLink, RouterOutlet } from "@angular/router";
import { AsyncPipe, CommonModule } from '@angular/common';
import { Home } from './component/home/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, AsyncPipe],
  // imports: [RouterOutlet, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('psieczkole');

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.fetchCurrentUser();
    this.authService.checkAuthStatus();
  }
  logout() {
    this.authService.logout();
  }
}
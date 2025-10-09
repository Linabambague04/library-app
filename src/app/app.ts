import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('library-app');

  constructor(private auth: AuthService, private router: Router) {}

  isLogged(): boolean {
    return !!this.auth.getToken();
  }

  isAuthor(): boolean {
    return this.auth.isAuthor();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.clearToken();
        this.auth.clearUser();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.auth.clearToken();
        this.auth.clearUser();
        this.router.navigate(['/login']);
      }
    });
  }
}

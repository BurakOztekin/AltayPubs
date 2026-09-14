import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.router.navigate(['/publishers']);
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Invalid username or password.';
      }
    });
  }
}

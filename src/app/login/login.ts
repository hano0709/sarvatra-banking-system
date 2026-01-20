import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  message = '';
  isSubmitting = false;

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    if (this.isSubmitting) return;

    const payload = {
      userName: this.username.trim(),
      password: this.password,
    };

    if (!payload.userName || !payload.password) {
      this.message = 'Please enter username and password.';
      return;
    }

    this.message = '';
    this.isSubmitting = true;

    this.http
      .post<{ authenticated: boolean; message: string }>(
        'http://localhost:8080/api/auth/login',
        payload,
      )
      .subscribe({
        next: (res) => {
          this.message = res?.message ?? '';
          if (res?.authenticated) {
            this.router.navigate(['/home']);
          }
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Login failed', err);
          this.message = 'Login request failed. Please try again.';
          this.isSubmitting = false;
        },
      });
  }
}

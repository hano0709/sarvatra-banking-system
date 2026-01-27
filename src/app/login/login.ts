import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

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

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
  ) {}

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
      .post<{
        authenticated: boolean;
        message: string;
        acc_no?: string;
        name?: string;
        ifsc_no?: string
      }>('http://localhost:8080/api/auth/login', payload)
      .subscribe({
        next: (res) => {
          this.message = res?.message ?? '';
          if (res?.authenticated) {
            if (res.acc_no && res.name  && res.ifsc_no) {
              this.userService.setUserData(res.acc_no, res.name, res.ifsc_no);
            }
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

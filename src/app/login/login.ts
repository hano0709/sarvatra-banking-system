import { Component } from '@angular/core';
import { Home } from '../home/home';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Home],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}

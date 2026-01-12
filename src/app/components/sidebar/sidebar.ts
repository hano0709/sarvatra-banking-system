import { Component, Output, EventEmitter } from '@angular/core';
import { Login } from '../../login/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Output() fundTransferHover = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['/login']);
  }

  onFundTransferMouseEnter() {
    this.fundTransferHover.emit(true);
  }

  onFundTransferMouseLeave() {
    this.fundTransferHover.emit(false);
  }
}

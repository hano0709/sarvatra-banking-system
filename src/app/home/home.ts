import { Component } from '@angular/core';
import { Sidebar } from '../components/sidebar/sidebar';
import { Header } from '../components/header/header';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Sidebar, Header, RouterOutlet, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  
  isChildRouteActive = false;
  
  constructor(private router: Router) {}

  goToTransfer(transferType: string) {
    this.isChildRouteActive = true;
    this.router.navigate(['/components/transfer-details'], {
      queryParams: { transferType },
    });
  }

  onChildActivate() {
    this.isChildRouteActive = true;
  }
}

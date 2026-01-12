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
  showFundTransferDropdown = false;
  private dropdownHideTimeout?: ReturnType<typeof setTimeout>;
  
  constructor(private router: Router) {}

  goToTransfer(transferType: string) {
    this.isChildRouteActive = true;
    this.showFundTransferDropdown = false;
    this.router.navigate(['/components/transfer-details'], {
      queryParams: { transferType },
    });
  }

  onChildActivate() {
    this.isChildRouteActive = true;
  }

  onFundTransferHover(isHovered: boolean) {
    if (isHovered) {
      if (this.dropdownHideTimeout) {
        clearTimeout(this.dropdownHideTimeout);
        this.dropdownHideTimeout = undefined;
      }
      this.showFundTransferDropdown = true;
    } else {
      this.dropdownHideTimeout = setTimeout(() => {
        this.showFundTransferDropdown = false;
      }, 150);
    }
  }

  onDropdownHover(isHovered: boolean) {
    this.onFundTransferHover(isHovered);
  }
}

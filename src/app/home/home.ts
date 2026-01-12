import { Component } from '@angular/core';
import { Sidebar } from '../components/sidebar/sidebar';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-home',
  imports: [Sidebar, Header],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  
}

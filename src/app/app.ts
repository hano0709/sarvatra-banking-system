import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home],
  template: `
    <app-home></app-home>
  `,
  styleUrl: './app.scss',
})
export class App {

}

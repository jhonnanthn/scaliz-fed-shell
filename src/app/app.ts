import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScalizFooterComponent } from './components/scaliz-footer/scaliz-footer';
import { ScalizNavbarComponent } from './components/scaliz-navbar/scaliz-navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScalizNavbarComponent, ScalizFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'scaliz-shell';
}

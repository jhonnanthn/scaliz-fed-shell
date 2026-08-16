import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScalizFooterComponent } from './components/scaliz-footer/scaliz-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ScalizFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'scaliz-shell';
}

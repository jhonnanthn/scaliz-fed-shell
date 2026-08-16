import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-scaliz-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './scaliz-navbar.html',
  styleUrl: './scaliz-navbar.scss'
})
export class ScalizNavbarComponent {}

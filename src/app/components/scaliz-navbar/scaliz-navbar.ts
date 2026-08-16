import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-scaliz-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './scaliz-navbar.html',
  styleUrl: './scaliz-navbar.scss'
})
export class ScalizNavbarComponent {
  mobileMenuOpen = false;
  resourcesMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.resourcesMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleResourcesMenu(): void {
    this.resourcesMenuOpen = !this.resourcesMenuOpen;
  }
}

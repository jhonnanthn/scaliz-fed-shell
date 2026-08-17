import { Component } from '@angular/core';
import { ScalizResourcesSectionComponent } from '../../components/scaliz-resources-section/scaliz-resources-section';
import { ScalizPricingSectionComponent } from '../../components/scaliz-pricing-section/scaliz-pricing-section';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ScalizResourcesSectionComponent, ScalizPricingSectionComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Translation } from '../../shared/site-translations';

@Component({
  selector: 'app-auto-scaling-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auto-scaling-detail.component.html',
  styleUrl: '../iac-detail-card.component.css',
})
export class AutoScalingDetailComponent {
  @Input({ required: true }) currentPage!: Translation['iacPage'];
}

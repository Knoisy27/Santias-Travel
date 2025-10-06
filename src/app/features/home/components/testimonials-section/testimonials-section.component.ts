import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Testimonial } from '../../../../core/interfaces/testimonial.interface';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss'
})
export class TestimonialsSectionComponent {
  @Input() testimonials: Testimonial[] = [];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { SERVICES_SECTION_CONFIG } from '../../config/services-section.config';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.scss'
})
export class ServicesSectionComponent {
  readonly config = SERVICES_SECTION_CONFIG;
}


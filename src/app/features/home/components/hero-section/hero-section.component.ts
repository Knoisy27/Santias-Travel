import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AgencyInfo } from '../../../../core/interfaces/agency.interface';
import { AgencyService } from '../../../../core/services/agency.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input() agencyInfo: AgencyInfo | null = null;
  
  private agencyService = inject(AgencyService);

  openWhatsApp(): void {
    if (this.agencyInfo?.whatsapp) {
      const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus destinos de viaje.');
      window.open(`https://wa.me/${this.agencyInfo.whatsapp}?text=${message}`, '_blank');
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

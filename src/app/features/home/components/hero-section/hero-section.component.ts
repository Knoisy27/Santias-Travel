import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
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
export class HeroSectionComponent implements OnChanges {
  @Input() agencyInfo: AgencyInfo | null = null;
  
  private agencyService = inject(AgencyService);

  agencyInfoSignal = signal<AgencyInfo | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agencyInfo'] && this.agencyInfo) {
      this.agencyInfoSignal.set(this.agencyInfo);
    }
  }

  openWhatsApp(): void {
    const agencyInfo = this.agencyInfoSignal();
    if (agencyInfo?.whatsapp) {
      const cleanPhone = agencyInfo.whatsapp.replace(/\D/g, '');
      const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus destinos de viaje.');
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }
  }

  openInstagram(): void {
    const agencyInfo = this.agencyInfoSignal();
    if (agencyInfo?.socialMedia?.instagram) {
      window.open(agencyInfo.socialMedia.instagram, '_blank');
    }
  }

  openFacebook(): void {
    const agencyInfo = this.agencyInfoSignal();
    if (agencyInfo?.socialMedia?.facebook) {
      window.open(agencyInfo.socialMedia.facebook, '_blank');
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToGroupTrips(): void {
    const element = document.getElementById('group-trips-slider');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

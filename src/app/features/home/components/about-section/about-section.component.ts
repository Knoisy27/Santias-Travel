import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgencyInfo } from '../../../../core/interfaces/agency.interface';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss'
})
export class AboutSectionComponent {
  @Input() agencyInfo: AgencyInfo | null = null;

  // Datos por defecto basados en las especificaciones
  defaultStats = {
    yearsOfExperience: 7,
    destinationsAvailable: 50,
    happyClients: 106000,
    certifications: [
      {
        id: '1',
        name: 'Atención personalizada por WhatsApp 24/7',
        description: 'Hablas siempre con tu agente de confianza. Sin robots, con personas.',
        icon: 'whatsapp'
      },
      {
        id: '2',
        name: 'Agencia legal certificada - (RNT 133939)',
        description: 'Viaja tranquilo. Somos una agencia registrada y respaldada por la ley.',
        icon: 'certificate'
      }
    ]
  };

  get stats() {
    return this.agencyInfo?.statistics || this.defaultStats;
  }

  get certifications() {
    return this.agencyInfo?.certifications || this.defaultStats.certifications;
  }
}

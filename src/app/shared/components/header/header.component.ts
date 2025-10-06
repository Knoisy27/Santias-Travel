import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { AgencyService } from '../../../core/services/agency.service';
import { AgencyInfo } from '../../../core/interfaces/agency.interface';
import { NewsletterDialogService } from '../../services/newsletter-dialog.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private router = inject(Router);
  private newsletterService = inject(NewsletterDialogService);
  
  agencyInfo = signal<AgencyInfo | null>(null);
  isMenuOpen = signal(false);

  ngOnInit(): void {
    this.loadAgencyInfo();
  }

  private loadAgencyInfo(): void {
    // TODO: Comentado temporalmente hasta que el backend esté listo
    // this.agencyService.getAgencyInfo().subscribe({
    //   next: (info) => this.agencyInfo.set(info),
    //   error: (error) => console.error('Error cargando información de la agencia:', error)
    // });
    
    // Usar datos mock por ahora
    const mockAgencyInfo = {
      name: 'Santias Travel',
      description: 'Tu agencia de viajes de confianza',
      logo: '',
      email: 'info@santiastravel.com',
      phone: '+57 300 123 4567',
      whatsapp: '573001234567',
      address: 'Bogotá, Colombia',
      city: 'Bogotá',
      country: 'Colombia',
      socialMedia: {
        facebook: 'https://facebook.com/santiastravel',
        instagram: 'https://instagram.com/santiastravel'
      },
      statistics: {
        yearsOfExperience: 7,
        destinationsAvailable: 50,
        happyClients: 106000,
        tripsCompleted: 5000
      },
      certifications: []
    };
    this.agencyInfo.set(mockAgencyInfo);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();
    
    // Si estamos en la página home, hacer scroll directo
    if (this.router.url === '/') {
      this.scrollToElement(sectionId);
    } else {
      // Si no estamos en home, navegar y luego hacer scroll
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToElement(sectionId), 100);
      });
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openWhatsApp(): void {
    const agencyInfo = this.agencyInfo();
    if (agencyInfo?.whatsapp) {
      const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus destinos de viaje.');
      window.open(`https://wa.me/${agencyInfo.whatsapp}?text=${message}`, '_blank');
    }
  }

  openNewsletterDialog(): void {
    this.newsletterService.openNewsletterDialog().subscribe(result => {
      if (result) {
        // Usuario se suscribió al newsletter
      }
    });
  }
}

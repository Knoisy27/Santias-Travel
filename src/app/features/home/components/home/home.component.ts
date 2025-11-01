import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TripsService, ViajeGrupal } from '../../../../core/services/trips.service';
import { TestimonialService } from '../../../../core/services/testimonial.service';
import { AgencyService } from '../../../../core/services/agency.service';
import { Testimonial } from '../../../../core/interfaces/testimonial.interface';
import { AgencyInfo } from '../../../../core/interfaces/agency.interface';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AboutSectionComponent } from '../about-section/about-section.component';
import { ExperiencesSectionComponent } from '../experiences-section/experiences-section.component';
import { TestimonialsSectionComponent } from '../testimonials-section/testimonials-section.component';
// import { NewsletterPopupComponent } from '../newsletter-popup/newsletter-popup.component'; // No usado

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    HeroSectionComponent,
    AboutSectionComponent,
    ExperiencesSectionComponent,
    TestimonialsSectionComponent
    // NewsletterPopupComponent // No usado
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private tripsService = inject(TripsService);
  private testimonialService = inject(TestimonialService);
  private agencyService = inject(AgencyService);

  agencyInfo = signal<AgencyInfo | null>(null);
  featuredTrips = signal<ViajeGrupal[]>([]);
  featuredTestimonials = signal<Testimonial[]>([]);
  isLoading = signal(true);
  showNewsletterPopup = signal(false);

  ngOnInit(): void {
    this.loadHomeData();
    // this.scheduleNewsletterPopup(); // Comentado: no queremos el popup automático
  }

  private loadHomeData(): void {
    this.isLoading.set(true);

    // Por ahora, cargar datos de ejemplo hasta que el backend esté conectado
    this.loadMockData();
  }

  private loadMockData(): void {
    // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      // Datos de ejemplo para la agencia
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

    // Datos de ejemplo para viajes grupales
    const mockTrips: ViajeGrupal[] = [];

    // Datos de ejemplo para testimonios
    const mockTestimonials = [
      {
        id: '1',
        clientName: 'María García',
        clientCity: 'Bogotá',
        clientCountry: 'Colombia',
        rating: 5,
        comment: 'Una experiencia increíble. Todo perfectamente organizado y el servicio excepcional.',
        destinationId: '1',
        destinationName: 'Sudáfrica',
        travelDate: new Date('2024-01-15'),
        isVerified: true,
        isHighlighted: true,
        createdAt: new Date()
      }
    ];

      // Setear datos después de nextTick para evitar errores de detección de cambios
      this.agencyInfo.set(mockAgencyInfo);
      this.featuredTrips.set(mockTrips);
      this.featuredTestimonials.set(mockTestimonials);
      this.isLoading.set(false);
    }, 0);
  }

  // COMENTADO: Popup de newsletter deshabilitado por petición del usuario
  // private scheduleNewsletterPopup(): void {
  //   // Mostrar popup después de 10 segundos
  //   setTimeout(() => {
  //     this.showNewsletterPopup.set(true);
  //   }, 10000);
  // }

  // onNewsletterPopupClose(): void {
  //   this.showNewsletterPopup.set(false);
  // }
}

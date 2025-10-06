import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { DestinationService } from '../../../../core/services/destination.service';
import { TestimonialService } from '../../../../core/services/testimonial.service';
import { AgencyService } from '../../../../core/services/agency.service';
import { Destination } from '../../../../core/interfaces/destination.interface';
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
  private destinationService = inject(DestinationService);
  private testimonialService = inject(TestimonialService);
  private agencyService = inject(AgencyService);

  agencyInfo = signal<AgencyInfo | null>(null);
  featuredDestinations = signal<Destination[]>([]);
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

    // Datos de ejemplo para destinos
    const mockDestinations = [
      {
        id: '1',
        name: 'Sudáfrica',
        description: 'Descubre la magia de Sudáfrica',
        shortDescription: 'Aventuras inolvidables por los destinos más increíbles',
        country: 'Sudáfrica',
        continent: 'África',
        price: 3200,
        currency: 'USD',
        duration: 15,
        durationNights: 14,
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
        gallery: [],
        highlights: [],
        included: [],
        notIncluded: [],
        itinerary: [],
        category: { id: '1', name: 'Aventura', description: '', icon: '' },
        isGroupTravel: true,
        isCustomizable: false,
        maxCapacity: 20,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Egipto & Jordania',
        description: 'Exploración histórica por Egipto y Jordania',
        shortDescription: 'Viaje por la historia antigua de dos civilizaciones',
        country: 'Egipto',
        continent: 'África',
        price: 3200,
        currency: 'USD',
        duration: 12,
        durationNights: 11,
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400',
        gallery: [],
        highlights: [],
        included: [],
        notIncluded: [],
        itinerary: [],
        category: { id: '2', name: 'Cultural', description: '', icon: '' },
        isGroupTravel: true,
        isCustomizable: false,
        maxCapacity: 15,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'México',
        description: 'Tour cultural por México',
        shortDescription: 'Explora la riqueza cultural y gastronómica de México',
        country: 'México',
        continent: 'América',
        price: 1700,
        currency: 'USD',
        duration: 8,
        durationNights: 7,
        image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400',
        gallery: [],
        highlights: [],
        included: [],
        notIncluded: [],
        itinerary: [],
        category: { id: '3', name: 'Cultural', description: '', icon: '' },
        isGroupTravel: true,
        isCustomizable: true,
        maxCapacity: 25,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Tailandia',
        description: 'Aventura en Tailandia',
        shortDescription: 'Templos, playas paradisíacas y cultura asiática',
        country: 'Tailandia',
        continent: 'Asia',
        price: 2800,
        currency: 'USD',
        duration: 12,
        durationNights: 11,
        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400',
        gallery: [],
        highlights: [],
        included: [],
        notIncluded: [],
        itinerary: [],
        category: { id: '4', name: 'Playa', description: '', icon: '' },
        isGroupTravel: true,
        isCustomizable: false,
        maxCapacity: 18,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Grecia',
        description: 'Islas griegas y historia antigua',
        shortDescription: 'Romance, historia y paisajes mediterráneos únicos',
        country: 'Grecia',
        continent: 'Europa',
        price: 2400,
        currency: 'USD',
        duration: 10,
        durationNights: 9,
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
        gallery: [],
        highlights: [],
        included: [],
        notIncluded: [],
        itinerary: [],
        category: { id: '5', name: 'Romántico', description: '', icon: '' },
        isGroupTravel: true,
        isCustomizable: true,
        maxCapacity: 20,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

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
      this.featuredDestinations.set(mockDestinations);
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

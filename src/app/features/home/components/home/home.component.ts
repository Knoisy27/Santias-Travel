import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TestimonialService } from '../../../../core/services/testimonial.service';
import { AgencyService } from '../../../../core/services/agency.service';
import { SEOService } from '../../../../core/services/seo.service';
import { Testimonial } from '../../../../core/interfaces/testimonial.interface';
import { AgencyInfo } from '../../../../core/interfaces/agency.interface';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AboutSectionComponent } from '../about-section/about-section.component';
import { TestimonialsSectionComponent } from '../testimonials-section/testimonials-section.component';
import { TripsSliderComponent } from '../trips-slider/trips-slider.component';
import { GroupTripsSliderComponent } from '../group-trips-slider/group-trips-slider.component';
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
    TestimonialsSectionComponent,
    TripsSliderComponent,
    GroupTripsSliderComponent
    // NewsletterPopupComponent // No usado
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private testimonialService = inject(TestimonialService);
  private agencyService = inject(AgencyService);
  private mockDataService = inject(MockDataService);
  private seoService = inject(SEOService);

  agencyInfo = signal<AgencyInfo | null>(null);
  featuredTestimonials = signal<Testimonial[]>([]);
  isLoading = signal(true);
  showNewsletterPopup = signal(false);

  ngOnInit(): void {
    // Actualizar meta tags SEO para la página de inicio
    this.seoService.updateHomePageMeta();
    
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
      // Usar datos mock centralizados para la agencia
      this.mockDataService.getAgencyInfo().subscribe({
        next: (info) => {
          this.agencyInfo.set(info);
          
          // Testimonios reales de Google Reviews
          const mockTestimonials = [
            {
              id: '1',
              clientName: 'Manuela Rivera Puerta',
              clientCity: 'Colombia',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'Excelente experiencia con Santías Travel. Mi viaje a Ciudad de México y Cancún fue increíble, todo estuvo muy bien planeado. La organización, atención y acompañamiento fue impecable. Disfruté el viaje al máximo sin preocuparme por nada. Sin duda volvería a viajar con ellos. ¡Gracias por todo! ✈️🇲🇽❤️',
              destinationId: '1',
              destinationName: 'México',
              travelDate: new Date('2025-01-10'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            {
              id: '2',
              clientName: 'Angie Gutierrez',
              clientCity: 'Colombia',
              clientCountry: 'Colombia',
              rating: 5,
              comment: '10 / 10 una agencia super recomendada cumplen con todo, confiable, y están atentos todo el tiempo. Gracias santias travel por tan maravillosas vacaciones',
              destinationId: '2',
              destinationName: 'La Guajira',
              travelDate: new Date('2025-01-10'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            {
              id: '3',
              clientName: 'Esmeralda Puerta Monsalve',
              clientCity: 'Colombia',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'Excelente experiencia con santias travel, mis mejores vacaciones, súper recomendado 100/10',
              destinationId: '3',
              destinationName: 'República Dominicana',
              travelDate: new Date('2025-01-10'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            {
              id: '4',
              clientName: 'Angie Gutierrez',
              clientCity: 'Colombia',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'Viaje con mi familia a santa Marta, muy buena agencia. En cualquier situación estaban atentos.',
              destinationId: '4',
              destinationName: 'Santa Marta',
              travelDate: new Date('2025-01-11'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            {
              id: '5',
              clientName: 'Luz Stella Delgado',
              clientCity: 'Colombia',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'Excelente viaje a Boyacá, estuvimos 5 días conociendo sitios maravillosos. La guía muy responsable, se cumplió con todo lo ofertado. Se recomienda 100%',
              destinationId: '5',
              destinationName: 'Boyacá',
              travelDate: new Date('2025-01-12'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            {
              id: '6',
              clientName: 'Norbey Holguin Rivera',
              clientCity: 'Colombia',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'Fue un paseo maravilloso lleno de sorpresas y sobretodo excelentes atenciones, hoteles super cómodos y un itinerario ajustado al tiempo. Muy satisfecho quedamos, gracias Luisa por tu liderazgo. Estamos casos para otra salida ojalá con el mismo grupo y otros más. Un abrazo',
              destinationId: '6',
              destinationName: 'Boyacá',
              travelDate: new Date('2025-01-12'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            {
              id: '7',
              clientName: 'Gabi Sarmiento',
              clientCity: 'Colombia',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'Quiero recomendar muchísimo esta agencia. Hace poco viajé con mi abuela a Boyacá y la experiencia fue simplemente hermosa. La organización y el cuidado que tuvieron, hicieron que disfrutáramos cada momento sin preocupaciones. Súper recomendados!',
              destinationId: '7',
              destinationName: 'Boyacá',
              travelDate: new Date('2025-01-12'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
          ];
          
          this.featuredTestimonials.set(mockTestimonials);
          this.isLoading.set(false);
        },
        error: (error) => {
          // Fallback a constantes si hay error
          this.agencyInfo.set(APP_CONSTANTS.AGENCY_INFO);
          this.isLoading.set(false);
        }
      });
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

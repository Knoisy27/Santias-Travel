import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TestimonialService } from '../../../../core/services/testimonial.service';
import { AgencyService } from '../../../../core/services/agency.service';
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

  agencyInfo = signal<AgencyInfo | null>(null);
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
      // Usar datos mock centralizados para la agencia
      this.mockDataService.getAgencyInfo().subscribe({
        next: (info) => {
          this.agencyInfo.set(info);
          
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
              destinationName: 'México',
              travelDate: new Date('2025-03-15'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            
            {
              id: '2',
              clientName: 'Juan Martínez',
              clientCity: 'Cali',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'Excelente servicio, muy profesional y atento a las necesidades de los clientes.',
              destinationId: '2',
              destinationName: 'Perú',
              travelDate: new Date('2025-06-15'),
              isVerified: true,
              isHighlighted: true,
              createdAt: new Date()
            },
            {
              id: '3',
              clientName: 'Camila Hurtado',
              clientCity: 'Medellín',
              clientCountry: 'Colombia',
              rating: 5,
              comment: 'El viaje superó todas mis expectativas, atención y organización de primera.',
              destinationId: '2',
              destinationName: 'Punta Cana',
              travelDate: new Date('2025-09-15'),
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

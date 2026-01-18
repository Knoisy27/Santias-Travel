import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { AgencyService } from '../../../../core/services/agency.service';
import { SEOService } from '../../../../core/services/seo.service';
import { AgencyInfo } from '../../../../core/interfaces/agency.interface';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  template: `
    <section class="contact-section">
      <div class="container">
        <div class="contact-header">
          <h1>Contáctanos</h1>
          <p class="lead">¿Listo para tu próxima aventura? Estamos aquí para ayudarte a crear el viaje perfecto.</p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            @if (agencyInfo()) {
              <div class="info-card" (click)="callPhone()" style="cursor: pointer;">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <h3>Teléfono</h3>
                <p>{{ agencyInfo()!.phone }}</p>
                <p>Lun - Vie: 8:00 AM - 12:00 PM - 2:00 PM - 6:00 PM</p>
                <p>Sab: 8:00 AM - 12:00 PM</p>
              </div>
              
              <div class="info-card" (click)="sendEmail()" style="cursor: pointer;">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <h3>Email</h3>
                <p>{{ agencyInfo()!.email }}</p>
                <p>Respuesta en 24 horas</p>
              </div>
              
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3>Oficina</h3>
                <p>{{ agencyInfo()!.address }}</p>
                <p>{{ agencyInfo()!.city }}, {{ agencyInfo()!.country }}</p>
              </div>
            } @else {
              <div class="info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <h3>Teléfono</h3>
                <p>Cargando...</p>
              </div>
            }
          </div>
          
          <app-contact-form></app-contact-form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      padding: 80px 0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: calc(100vh - 200px);
    }

    .contact-header {
      text-align: center;
      margin-bottom: 60px;
      
      h1 {
        font-size: 3rem;
        color: #1e293b;
        margin-bottom: 20px;
        
        @media (max-width: 768px) {
          font-size: 2.5rem;
        }
      }
      
      .lead {
        font-size: 1.25rem;
        color: #64748b;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
      }
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .info-card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }
      
      .info-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        
        svg {
          color: white;
          width: 24px;
          height: 24px;
        }
      }
      
      h3 {
        color: #1e293b;
        margin-bottom: 10px;
        font-size: 1.25rem;
      }
      
      p {
        color: #64748b;
        margin: 5px 0;
        
        &:first-of-type {
          font-weight: 600;
          color: #374151;
        }
      }
    }

    @media (max-width: 768px) {
      .contact-section {
        padding: 60px 0;
      }
      
      .contact-info {
        order: 2;
      }
      
      .info-card {
        padding: 24px;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private mockDataService = inject(MockDataService);
  private seoService = inject(SEOService);
  
  agencyInfo = signal<AgencyInfo | null>(null);

  ngOnInit(): void {
    // Actualizar meta tags SEO
    this.seoService.updateContactPageMeta();
    
    this.loadAgencyInfo();
  }

  private loadAgencyInfo(): void {
    this.mockDataService.getAgencyInfo().subscribe({
      next: (info) => this.agencyInfo.set(info),
      error: (error) => {
        this.agencyInfo.set(APP_CONSTANTS.AGENCY_INFO);
      }
    });
  }

  callPhone(): void {
    const agencyInfo = this.agencyInfo();
    if (agencyInfo?.phone) {
      window.open(`tel:${agencyInfo.phone}`, '_self');
    }
  }

  sendEmail(): void {
    const agencyInfo = this.agencyInfo();
    if (agencyInfo?.email) {
      window.open(`mailto:${agencyInfo.email}`, '_self');
    }
  }
}

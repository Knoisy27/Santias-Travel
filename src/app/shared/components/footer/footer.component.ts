import { Component, OnInit, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { AgencyService } from '../../../core/services/agency.service';
import { AgencyInfo, NewsletterSubscription } from '../../../core/interfaces/agency.interface';
import { NotificationService } from '../../services/notification.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private mockDataService = inject(MockDataService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  
  agencyInfo = signal<AgencyInfo | null>(null);
  isSubscribing = signal(false);
  currentYear = new Date().getFullYear();
  
  newsletterForm: FormGroup;

  constructor() {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadAgencyInfo();
  }

  private loadAgencyInfo(): void {
    // TODO: Comentado temporalmente hasta que el backend esté listo
    // this.agencyService.getAgencyInfo().subscribe({
    //   next: (info) => this.agencyInfo.set(info),
    //   error: (error) => console.error('Error cargando información de la agencia:', error)
    // });
    
    // Usar datos mock centralizados
    this.mockDataService.getAgencyInfo().subscribe({
      next: (info) => this.agencyInfo.set(info),
      error: (error) => {
        // Fallback a constantes si hay error
        this.agencyInfo.set(APP_CONSTANTS.AGENCY_INFO);
      }
    });
  }

  subscribeToNewsletter(): void {
    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    const email = this.newsletterForm.get('email')?.value;
    this.isSubscribing.set(true);
    this.newsletterForm.get('email')?.disable();

    const subscription: NewsletterSubscription = {
      email,
      acceptsTerms: true
    };

    this.mockDataService.subscribeToNewsletter(subscription).subscribe({
      next: () => {
        this.notificationService.success(
          '¡Suscripción exitosa! Recibirás nuestras mejores ofertas.',
          'Genial',
          APP_CONSTANTS.NOTIFICATION_CONFIG.duration.medium
        );
        this.newsletterForm.reset();
        this.newsletterForm.get('email')?.enable();
        this.isSubscribing.set(false);
      },
      error: (error) => {
        this.notificationService.error(
          'Error al suscribirse. Inténtalo de nuevo.',
          'Reintentar'
        );
        this.newsletterForm.get('email')?.enable();
        this.isSubscribing.set(false);
      }
    });
  }

  openSocialMedia(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  openWhatsApp(): void {
    const agencyInfo = this.agencyInfo();
    if (agencyInfo?.whatsapp) {
      const cleanPhone = agencyInfo.whatsapp.replace(/\D/g, '');
      const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus destinos de viaje.');
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }
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

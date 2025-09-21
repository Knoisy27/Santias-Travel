import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencyService } from '../../../../core/services/agency.service';
import { NewsletterSubscription } from '../../../../core/interfaces/agency.interface';

@Component({
  selector: 'app-newsletter-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter-popup.component.html',
  styleUrl: './newsletter-popup.component.scss'
})
export class NewsletterPopupComponent {
  @Output() close = new EventEmitter<void>();
  
  private agencyService = inject(AgencyService);
  
  email = signal('');
  isSubscribing = signal(false);
  message = signal('');

  closePopup(): void {
    this.close.emit();
  }

  subscribe(): void {
    const emailValue = this.email().trim();
    
    if (!emailValue || !this.isValidEmail(emailValue)) {
      this.message.set('Por favor ingresa un email válido');
      return;
    }

    this.isSubscribing.set(true);
    this.message.set('');

    const subscription: NewsletterSubscription = {
      email: emailValue,
      acceptsTerms: true
    };

    this.agencyService.subscribeToNewsletter(subscription).subscribe({
      next: () => {
        this.message.set('¡Suscripción exitosa! Recibirás nuestras mejores ofertas.');
        setTimeout(() => this.closePopup(), 2000);
      },
      error: () => {
        this.message.set('Error al suscribirse. Inténtalo de nuevo.');
        this.isSubscribing.set(false);
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

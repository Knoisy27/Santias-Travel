import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { AgencyService } from '../../../core/services/agency.service';
import { NewsletterSubscription } from '../../../core/interfaces/agency.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-newsletter-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="newsletter-dialog">
      <mat-dialog-content>
        <div class="dialog-header">
          <mat-icon class="newsletter-icon" color="primary">mail</mat-icon>
          <h2 mat-dialog-title>¡Suscríbete a nuestro newsletter!</h2>
          <p class="dialog-subtitle">
            Recibe ofertas exclusivas y promociones especiales directamente en tu email.
          </p>
        </div>

        <form [formGroup]="newsletterForm" (ngSubmit)="subscribe()" class="newsletter-form">
          <mat-form-field appearance="outline" class="full-width">
            <input matInput 
                   type="email" 
                   formControlName="email"
                   placeholder="Correo electrónico"
                   [disabled]="isSubscribing()">
            <mat-icon matSuffix>email</mat-icon>
            @if (newsletterForm.get('email')?.hasError('required') && newsletterForm.get('email')?.touched) {
              <mat-error>El email es requerido</mat-error>
            }
            @if (newsletterForm.get('email')?.hasError('email') && newsletterForm.get('email')?.touched) {
              <mat-error>Ingresa un email válido</mat-error>
            }
          </mat-form-field>

          <div class="checkbox-container">
            <mat-checkbox formControlName="acceptsTerms" color="primary">
              Acepto los 
              <a href="/terminos" target="_blank" class="terms-link">términos y condiciones</a>
              y la 
              <a href="/privacidad" target="_blank" class="terms-link">política de privacidad</a>
            </mat-checkbox>
            @if (newsletterForm.get('acceptsTerms')?.hasError('required') && newsletterForm.get('acceptsTerms')?.touched) {
              <mat-error class="checkbox-error">Debes aceptar los términos y condiciones</mat-error>
            }
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="close()" [disabled]="isSubscribing()">
          Cancelar
        </button>
        <button mat-raised-button 
                color="primary" 
                (click)="subscribe()"
                [disabled]="newsletterForm.invalid || isSubscribing()"
                class="subscribe-btn">
          @if (isSubscribing()) {
            <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
            &nbsp;Suscribiendo...
          } @else {
            <ng-container>
              <mat-icon>send</mat-icon>
              Suscribirse
            </ng-container>
          }
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .newsletter-dialog {
      min-width: 400px;
      max-width: 500px;
      width: 100%;
      box-sizing: border-box;

      @media (max-width: 640px) {
        min-width: 300px;
        max-width: 90vw;
      }
    }

    .dialog-header {
      text-align: center;
      margin-bottom: 24px;

      .newsletter-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }

      h2 {
        color: #1e293b;
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 12px 0;
      }

      .dialog-subtitle {
        color: #64748b;
        font-size: 16px;
        line-height: 1.5;
        margin: 0;
      }
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .full-width {
        width: 100%;
      }

      .checkbox-container {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .terms-link {
          color: #3b82f6;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }

        .checkbox-error {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
        }
      }
    }

    /* Estilos globales para el dialog de newsletter */
    .newsletter-dialog-panel .mat-mdc-dialog-container {
      max-width: 500px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }

    .newsletter-dialog-panel .mat-mdc-dialog-content {
      max-width: 100% !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      padding: 24px !important;
      margin: 0 !important;
    }

    .newsletter-dialog-panel .mat-mdc-dialog-actions {
      max-width: 100% !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      padding: 16px 24px !important;
      margin: 0 !important;
      gap: 12px !important;
      justify-content: flex-end !important;
      flex-wrap: wrap !important;
      display: flex !important;
    }

    .newsletter-dialog-panel .subscribe-btn {
      min-width: 140px !important;
      max-width: 200px !important;
      font-weight: 600 !important;
      flex-shrink: 0 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }

    .newsletter-dialog-panel .subscribe-btn mat-progress-spinner {
      margin-right: 8px !important;
    }
    
    .newsletter-dialog-panel .subscribe-btn mat-icon {
      margin-right: 8px !important;
    }
  `]
})
export class NewsletterDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewsletterDialogComponent>);
  private notificationService = inject(NotificationService);
  private agencyService = inject(AgencyService);

  newsletterForm: FormGroup;
  isSubscribing = signal(false);

  constructor() {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      acceptsTerms: [false, [Validators.requiredTrue]]
    });
  }

  subscribe(): void {
    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }

    const { email, acceptsTerms } = this.newsletterForm.value;
    this.isSubscribing.set(true);

    const subscription: NewsletterSubscription = {
      email,
      acceptsTerms
    };

    this.agencyService.subscribeToNewsletter(subscription).subscribe({
      next: () => {
        this.notificationService.success(
          '¡Suscripción exitosa! Gracias por unirte a nuestra comunidad.',
          'Ver ofertas',
          5000
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.notificationService.error(
          'Error al suscribirse. Por favor, inténtalo de nuevo.',
          'Reintentar'
        );
        this.isSubscribing.set(false);
        console.error('Error en suscripción:', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}

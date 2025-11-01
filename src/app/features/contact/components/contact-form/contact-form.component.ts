import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';
import { UtilsService } from '../../../../core/services/utils.service';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="contact-form">
      <mat-card class="contact-card">
        <mat-card-header class='mb-4'>
          <mat-card-title>Contáctanos</mat-card-title>
          <mat-card-subtitle>Estamos aquí para ayudarte a planear tu viaje perfecto</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form-fields">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <input matInput formControlName="name" placeholder="Nombre completo">
                <mat-icon matSuffix>person</mat-icon>
                @if (contactForm.get('name')?.hasError('required') && contactForm.get('name')?.touched) {
                  <mat-error>El nombre es requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <input matInput type="email" formControlName="email" placeholder="Correo electrónico">
                <mat-icon matSuffix>email</mat-icon>
                @if (contactForm.get('email')?.hasError('required') && contactForm.get('email')?.touched) {
                  <mat-error>El email es requerido</mat-error>
                }
                @if (contactForm.get('email')?.hasError('email') && contactForm.get('email')?.touched) {
                  <mat-error>Ingresa un email válido</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <input matInput type="tel" formControlName="phone" placeholder="Teléfono">
                <mat-icon matSuffix>phone</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-select formControlName="destination" placeholder="Destino de interés">
                  <mat-option value="">Selecciona un destino</mat-option>
                  <mat-option value="europa">Europa</mat-option>
                  <mat-option value="asia">Asia</mat-option>
                  <mat-option value="america">América</mat-option>
                  <mat-option value="africa">África</mat-option>
                  <mat-option value="oceania">Oceanía</mat-option>
                </mat-select>
                <mat-icon matSuffix>place</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="date-picker">
                <input matInput [matDatepicker]="picker" formControlName="travelDate" placeholder="Fecha de viaje" readonly>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="travelers">
                <mat-select formControlName="travelers" placeholder="Número de viajeros">
                  <mat-option value="1">1 persona</mat-option>
                  <mat-option value="2">2 personas</mat-option>
                  <mat-option value="3">3 personas</mat-option>
                  <mat-option value="4">4 personas</mat-option>
                  <mat-option value="5+">5+ personas</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <textarea matInput formControlName="message" rows="4" 
                         placeholder="Mensaje - Cuéntanos sobre el viaje de tus sueños..."></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="contactForm.invalid || isSubmitting()" 
                      class="submit-btn whatsapp-btn">
                @if (isSubmitting()) {
                  <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
                  Abriendo WhatsApp...
                } @else {
                  <ng-container>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div>
                        Enviar por WhatsApp
                      </div>
                      <div>
                        <svg class="whatsapp-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.319 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                    </div>
                  </ng-container>
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .contact-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }

    .contact-card {
      padding: 0;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
    }

    .contact-form-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      
      &:has(.full-width) {
        flex-direction: column;
        gap: 0;
      }
    }

    .full-width {
      width: 100%;
    }

    .date-picker {
      flex: 1;
    }

    .travelers {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }

    .submit-btn {
      min-width: 200px;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 24px;
      
      &.whatsapp-btn {
        background-color: #25D366 !important;
        color: white !important;
        
        &:hover:not(:disabled) {
          background-color: #20BA5A !important;
        }
        
        &:disabled {
          background-color: #ccc !important;
        }
      }
      
      mat-progress-spinner {
        margin-right: 8px;
      }
      
      .whatsapp-icon {
        margin-right: 8px;
        width: 20px;
        height: 20px;
      }
      
      mat-icon {
        margin-right: 8px;
      }
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        
        .date-picker,
        .travelers {
          width: 100%;
        }
      }
    }
  `]
})
export class ContactFormComponent {
  private utilsService = inject(UtilsService);
  
  contactForm: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      destination: [''],
      travelDate: [''],
      travelers: ['2'],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      
      // Construir mensaje estructurado para WhatsApp
      const formData = this.contactForm.value;
      let whatsappMessage = '¡Hola! Me interesa solicitar información sobre viajes.\n\n';
      whatsappMessage += '*Información de contacto:*\n';
      whatsappMessage += `• Nombre: ${formData.name}\n`;
      whatsappMessage += `• Email: ${formData.email}\n`;
      
      if (formData.phone) {
        whatsappMessage += `• Teléfono: ${formData.phone}\n`;
      }
      
      whatsappMessage += '\n*Detalles del viaje:*\n';
      
      if (formData.destination) {
        const destinationLabels: { [key: string]: string } = {
          'europa': 'Europa',
          'asia': 'Asia',
          'america': 'América',
          'africa': 'África',
          'oceania': 'Oceanía'
        };
        whatsappMessage += `• Destino de interés: ${destinationLabels[formData.destination] || formData.destination}\n`;
      }
      
      if (formData.travelDate) {
        const date = new Date(formData.travelDate);
        const formattedDate = date.toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        whatsappMessage += `• Fecha de viaje: ${formattedDate}\n`;
      }
      
      if (formData.travelers) {
        whatsappMessage += `• Número de viajeros: ${formData.travelers}\n`;
      }
      
      if (formData.message) {
        whatsappMessage += `\n*Mensaje:*\n${formData.message}\n`;
      }
      
      whatsappMessage += '\n¿Podrían brindarme más información?';
      
      // Abrir WhatsApp con el mensaje
      const whatsappNumber = APP_CONSTANTS.AGENCY_INFO.whatsapp;
      this.utilsService.openWhatsApp(whatsappNumber, whatsappMessage);
      
      // No resetear el formulario, mantener la información
      setTimeout(() => {
        this.isSubmitting.set(false);
      }, 500);
    }
  }
}

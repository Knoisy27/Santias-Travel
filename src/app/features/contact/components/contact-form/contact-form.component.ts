import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  template: `
    <div class="contact-form">
      <mat-card class="contact-card">
        <mat-card-header>
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
                      class="submit-btn">
                @if (isSubmitting()) {
                  <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
                  Enviando...
                } @else {
                  <ng-container>
                    <mat-icon>send</mat-icon>
                    Enviar consulta
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
      
      mat-progress-spinner {
        margin-right: 8px;
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
      
      // Simular envío
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.contactForm.reset();
        
        // Aquí iría la lógica real de envío al backend
      }, 2000);
    }
  }
}

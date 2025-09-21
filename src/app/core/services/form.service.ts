import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private fb = inject(FormBuilder);

  /**
   * Crea un formulario de contacto con validaciones
   */
  createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        this.noWhitespaceValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      phone: ['', [
        Validators.pattern(/^[\+]?[0-9\s\-\(\)]{7,15}$/),
        Validators.maxLength(20)
      ]],
      destination: [''],
      travelDate: [''],
      travelers: ['2'],
      message: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      preferredContactMethod: ['email']
    });
  }

  /**
   * Crea un formulario de newsletter con validaciones
   */
  createNewsletterForm(): FormGroup {
    return this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      acceptsTerms: [false, [Validators.requiredTrue]]
    });
  }

  /**
   * Crea un formulario de búsqueda con validaciones
   */
  createSearchForm(): FormGroup {
    return this.fb.group({
      query: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      category: [''],
      minPrice: [null, [Validators.min(0)]],
      maxPrice: [null, [Validators.min(0)]],
      duration: [null, [Validators.min(1)]]
    });
  }

  /**
   * Validador personalizado para evitar solo espacios en blanco
   */
  private noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string') {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    }
    return null;
  }

  /**
   * Validador personalizado para fechas futuras
   */
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return { pastDate: true };
      }
    }
    return null;
  }

  /**
   * Validador personalizado para números de teléfono colombianos
   */
  colombianPhoneValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const phoneRegex = /^(\+57|57)?[1-9]\d{9}$/;
      if (!phoneRegex.test(control.value.replace(/\s/g, ''))) {
        return { invalidColombianPhone: true };
      }
    }
    return null;
  }

  /**
   * Validador personalizado para confirmación de email
   */
  emailMatchValidator(emailControlName: string, confirmEmailControlName: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const email = formGroup.get(emailControlName);
      const confirmEmail = formGroup.get(confirmEmailControlName);

      if (!email || !confirmEmail) {
        return null;
      }

      if (email.value !== confirmEmail.value) {
        confirmEmail.setErrors({ emailMismatch: true });
        return { emailMismatch: true };
      } else {
        confirmEmail.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Obtiene mensajes de error personalizados para validaciones
   */
  getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (control.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (control.hasError('email')) {
      return 'Ingresa un email válido';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName} debe tener al menos ${requiredLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength']?.requiredLength;
      return `${fieldName} no puede tener más de ${requiredLength} caracteres`;
    }
    if (control.hasError('pattern')) {
      return `${fieldName} tiene un formato inválido`;
    }
    if (control.hasError('whitespace')) {
      return `${fieldName} no puede estar vacío`;
    }
    if (control.hasError('pastDate')) {
      return 'La fecha debe ser futura';
    }
    if (control.hasError('invalidColombianPhone')) {
      return 'Ingresa un número de teléfono colombiano válido';
    }
    if (control.hasError('emailMismatch')) {
      return 'Los emails no coinciden';
    }
    return `${fieldName} es inválido`;
  }

  /**
   * Marca todos los campos del formulario como touched
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Resetea un formulario y limpia errores
   */
  resetForm(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.setErrors(null);
    });
  }

  /**
   * Obtiene opciones de destinos para formularios
   */
  getDestinationOptions() {
    return APP_CONSTANTS.FORM_CONFIG.contact.destinations;
  }

  /**
   * Obtiene opciones de viajeros para formularios
   */
  getTravelerOptions() {
    return APP_CONSTANTS.FORM_CONFIG.contact.travelers;
  }
}

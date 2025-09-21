import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AgencyInfo, NewsletterSubscription } from '../interfaces/agency.interface';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  /**
   * Obtiene la información de la agencia
   */
  getAgencyInfo(): Observable<AgencyInfo> {
    return of(APP_CONSTANTS.AGENCY_INFO as AgencyInfo).pipe(
      delay(500) // Simular latencia de red
    );
  }

  /**
   * Simula la suscripción al newsletter
   */
  subscribeToNewsletter(subscription: NewsletterSubscription): Observable<boolean> {
    // Simular procesamiento
    return of(true).pipe(
      delay(1000) // Simular latencia de red
    );
  }

  /**
   * Simula el envío de formulario de contacto
   */
  submitContactForm(formData: any): Observable<boolean> {
    // Simular procesamiento
    return of(true).pipe(
      delay(1500) // Simular latencia de red
    );
  }
}
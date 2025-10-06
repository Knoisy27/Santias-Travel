import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AgencyInfo, ContactForm, NewsletterSubscription } from '../interfaces/agency.interface';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private readonly endpoint = 'agency';

  constructor(private apiService: ApiService) {}

  /**
   * Obtener información de la agencia
   */
  getAgencyInfo(): Observable<AgencyInfo> {
    return this.apiService.get<AgencyInfo>(`${this.endpoint}/info`)
      .pipe(map(response => response.data));
  }

  /**
   * Enviar formulario de contacto
   */
  sendContactForm(contactForm: ContactForm): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/contact`, contactForm)
      .pipe(map(response => response.data));
  }

  /**
   * Suscribirse al newsletter
   */
  subscribeToNewsletter(subscription: NewsletterSubscription): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/newsletter/subscribe`, subscription)
      .pipe(map(response => response.data));
  }

  /**
   * Obtener estadísticas de la agencia
   */
  getAgencyStatistics(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/statistics`)
      .pipe(map(response => response.data));
  }

  /**
   * Solicitar cotización personalizada
   */
  requestQuote(quoteData: any): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/quote`, quoteData)
      .pipe(map(response => response.data));
  }
}

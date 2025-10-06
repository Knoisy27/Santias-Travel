import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, PaginatedResponse } from './api.service';
import { Testimonial, TestimonialSummary } from '../interfaces/testimonial.interface';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private readonly endpoint = 'testimonials';

  constructor(private apiService: ApiService) {}

  /**
   * Obtener testimonios con paginación
   */
  getTestimonials(page: number = 1, limit: number = 10, destinationId?: string): Observable<PaginatedResponse<Testimonial>> {
    const params = destinationId ? { destinationId } : {};
    
    return this.apiService.getPaginated<Testimonial>(this.endpoint, page, limit, params)
      .pipe(map(response => response.data));
  }

  /**
   * Obtener testimonios destacados para la página principal
   */
  getFeaturedTestimonials(limit: number = 6): Observable<Testimonial[]> {
    return this.apiService.get<Testimonial[]>(`${this.endpoint}/featured`, { limit })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener testimonios por destino
   */
  getTestimonialsByDestination(destinationId: string, page: number = 1, limit: number = 5): Observable<PaginatedResponse<Testimonial>> {
    return this.apiService.getPaginated<Testimonial>(`${this.endpoint}/destination/${destinationId}`, page, limit)
      .pipe(map(response => response.data));
  }

  /**
   * Obtener resumen de testimonios (estadísticas)
   */
  getTestimonialSummary(destinationId?: string): Observable<TestimonialSummary> {
    const params = destinationId ? { destinationId } : {};
    
    return this.apiService.get<TestimonialSummary>(`${this.endpoint}/summary`, params)
      .pipe(map(response => response.data));
  }

  /**
   * Crear nuevo testimonio
   */
  createTestimonial(testimonial: Partial<Testimonial>): Observable<Testimonial> {
    return this.apiService.post<Testimonial>(this.endpoint, testimonial)
      .pipe(map(response => response.data));
  }

  /**
   * Obtener testimonios más recientes
   */
  getRecentTestimonials(limit: number = 8): Observable<Testimonial[]> {
    return this.apiService.get<Testimonial[]>(`${this.endpoint}/recent`, { limit })
      .pipe(map(response => response.data));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse, PaginatedResponse } from './api.service';
import { Destination, DestinationFilters, DestinationCategory } from '../interfaces/destination.interface';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private readonly endpoint = 'destinations';

  constructor(private apiService: ApiService) {}

  /**
   * Obtener todos los destinos con filtros y paginación
   */
  getDestinations(page: number = 1, limit: number = 12, filters?: DestinationFilters): Observable<PaginatedResponse<Destination>> {
    const params = this.buildFilterParams(filters);
    
    return this.apiService.getPaginated<Destination>(this.endpoint, page, limit, params)
      .pipe(map(response => response.data));
  }

  /**
   * Obtener destino por ID
   */
  getDestinationById(id: string): Observable<Destination> {
    return this.apiService.get<Destination>(`${this.endpoint}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Obtener destinos destacados para la página principal
   */
  getFeaturedDestinations(limit: number = 6): Observable<Destination[]> {
    return this.apiService.get<Destination[]>(`${this.endpoint}/featured`, { limit })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener destinos más populares
   */
  getPopularDestinations(limit: number = 8): Observable<Destination[]> {
    return this.apiService.get<Destination[]>(`${this.endpoint}/popular`, { limit })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener categorías de destinos
   */
  getCategories(): Observable<DestinationCategory[]> {
    return this.apiService.get<DestinationCategory[]>('destination-categories')
      .pipe(map(response => response.data));
  }

  /**
   * Buscar destinos por término de búsqueda
   */
  searchDestinations(searchTerm: string, limit: number = 10): Observable<Destination[]> {
    return this.apiService.get<Destination[]>(`${this.endpoint}/search`, { q: searchTerm, limit })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener destinos relacionados
   */
  getRelatedDestinations(destinationId: string, limit: number = 4): Observable<Destination[]> {
    return this.apiService.get<Destination[]>(`${this.endpoint}/${destinationId}/related`, { limit })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener estadísticas de precios por categoría
   */
  getPriceStatistics(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/price-statistics`)
      .pipe(map(response => response.data));
  }

  /**
   * Construir parámetros de filtro para la API
   */
  private buildFilterParams(filters?: DestinationFilters): any {
    if (!filters) return {};

    const params: any = {};

    if (filters.categories && filters.categories.length > 0) {
      params.categories = filters.categories.join(',');
    }

    if (filters.minPrice !== undefined) {
      params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      params.maxPrice = filters.maxPrice;
    }

    if (filters.minDuration !== undefined) {
      params.minDuration = filters.minDuration;
    }

    if (filters.maxDuration !== undefined) {
      params.maxDuration = filters.maxDuration;
    }

    if (filters.continents && filters.continents.length > 0) {
      params.continents = filters.continents.join(',');
    }

    if (filters.countries && filters.countries.length > 0) {
      params.countries = filters.countries.join(',');
    }

    if (filters.isGroupTravel !== undefined) {
      params.isGroupTravel = filters.isGroupTravel;
    }

    if (filters.isCustomizable !== undefined) {
      params.isCustomizable = filters.isCustomizable;
    }

    if (filters.availability !== undefined) {
      params.availability = filters.availability;
    }

    return params;
  }
}

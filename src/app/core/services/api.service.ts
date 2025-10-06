import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Realizar petición GET
   */
  get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * Realizar petición GET para obtener datos paginados
   */
  getPaginated<T>(endpoint: string, page: number = 1, limit: number = 10, filters?: any): Observable<ApiResponse<PaginatedResponse<T>>> {
    let params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };

    return this.get<PaginatedResponse<T>>(endpoint, params);
  }

  /**
   * Realizar petición POST
   */
  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Realizar petición PUT
   */
  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Realizar petición PATCH
   */
  patch<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Realizar petición DELETE
   */
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejar errores de HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud inválida';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status}`;
      }
      
      // Si el servidor devuelve un mensaje de error específico
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('Error en API:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}

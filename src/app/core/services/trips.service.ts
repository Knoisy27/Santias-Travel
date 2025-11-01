import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ViajeGrupal {
  idVigr?: number;
  nombre: string;
  descripcion: string;
  valor: number;
  imagenUrl?: string;
  videoUrl?: string;
  fechaInicio: string;
  fechaFin: string;
  incluye: string;
  itinerario: string;
  noIncluye: string;
  sugerencias: string;
  estado: string;
  modificadoPor: string;
  creadoPor?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface ViajeIndividual {
  id?: number;
  nombre: string;
  descripcion: string;
  valor: number;
  imagenUrl?: string;
  videoUrl?: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  modificadoPor: string;
  creadoPor?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface ViajeGrupalCreateRequest {
  nombre: string;
  descripcion: string;
  valor: number;
  imagenUrl?: string;
  videoUrl?: string;
  fechaInicio: string;
  fechaFin: string;
  incluye: string;
  itinerario: string;
  noIncluye: string;
  sugerencias: string;
  estado: string;
  modificadoPor: string;
}

export interface ViajeIndividualCreateRequest {
  nombre: string;
  descripcion: string;
  valor: number;
  imagenUrl?: string;
  videoUrl?: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  modificadoPor: string;
}

export interface FileUploadResponse {
  url: string;
  message: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Viajes Grupales
  getViajesGrupales(): Observable<ViajeGrupal[]> {
    return this.http.get<ViajeGrupal[]>(`${this.baseUrl}/stViajesGrupales`);
  }

  getViajeGrupal(id: number): Observable<ViajeGrupal> {
    return this.http.get<ViajeGrupal>(`${this.baseUrl}/stViajesGrupales/${id}`);
  }

  createViajeGrupal(viaje: ViajeGrupalCreateRequest): Observable<ViajeGrupal> {
    return this.http.post<ViajeGrupal>(`${this.baseUrl}/stViajesGrupales`, viaje);
  }

  updateViajeGrupal(viaje: ViajeGrupal): Observable<ViajeGrupal> {
    return this.http.put<ViajeGrupal>(`${this.baseUrl}/stViajesGrupales`, viaje);
  }

  deleteViajeGrupal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stViajesGrupales/${id}`);
  }

  countViajesGrupales(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stViajesGrupales/count`);
  }

  // Métodos para subida de archivos
  uploadViajeGrupalImage(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<FileUploadResponse>(`${this.baseUrl}/files/upload/viajes-grupales`, formData);
  }

  uploadViajeImage(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<FileUploadResponse>(`${this.baseUrl}/files/upload/viajes`, formData);
  }

  uploadViajeVideo(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<FileUploadResponse>(`${this.baseUrl}/files/upload/viajes-grupales`, formData);
  }

  uploadViajeGrupalImageWithProgress(file: File): Observable<UploadProgress | FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = `${this.baseUrl}/files/upload/viajes-grupales`;
    
    return this.http.post<FileUploadResponse>(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event as HttpProgressEvent;
          return {
            loaded: progress.loaded || 0,
            total: progress.total || 0,
            percentage: progress.total ? Math.round(100 * progress.loaded / progress.total) : 0
          } as UploadProgress;
        } else if (event.type === HttpEventType.Response) {
          return event.body as FileUploadResponse;
        }
        return null;
      }),
      filter(result => result !== null)
    );
  }

  deleteFile(filePath: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/files/delete`, {
      params: { filePath }
    });
  }

  // Métodos para Viajes Individuales
  getViajesIndividuales(): Observable<ViajeIndividual[]> {
    return this.http.get<ViajeIndividual[]>(`${this.baseUrl}/stViajes`);
  }

  getViajeIndividual(id: number): Observable<ViajeIndividual> {
    return this.http.get<ViajeIndividual>(`${this.baseUrl}/stViajes/${id}`);
  }

  createViajeIndividual(viaje: ViajeIndividualCreateRequest): Observable<ViajeIndividual> {
    return this.http.post<ViajeIndividual>(`${this.baseUrl}/stViajes`, viaje);
  }

  updateViajeIndividual(id: number, viaje: ViajeIndividualCreateRequest): Observable<ViajeIndividual> {
    return this.http.put<ViajeIndividual>(`${this.baseUrl}/stViajes/${id}`, viaje);
  }

  deleteViajeIndividual(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/stViajes/${id}`);
  }
}

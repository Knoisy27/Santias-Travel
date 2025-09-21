import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;
  private loadingMessages = new BehaviorSubject<string>('Cargando...');

  /**
   * Observable para suscribirse al estado de loading
   */
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Observable para suscribirse a los mensajes de loading
   */
  loadingMessage$: Observable<string> = this.loadingMessages.asObservable();

  /**
   * Muestra el loading con un mensaje opcional
   */
  show(message: string = 'Cargando...'): void {
    this.loadingCount++;
    this.loadingMessages.next(message);
    this.loadingSubject.next(true);
  }

  /**
   * Oculta el loading
   */
  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    
    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
      this.loadingMessages.next('Cargando...');
    }
  }

  /**
   * Fuerza el ocultamiento del loading (útil para casos de error)
   */
  forceHide(): void {
    this.loadingCount = 0;
    this.loadingSubject.next(false);
    this.loadingMessages.next('Cargando...');
  }

  /**
   * Verifica si el loading está activo
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Obtiene el mensaje actual de loading
   */
  getCurrentMessage(): string {
    return this.loadingMessages.value;
  }

  /**
   * Actualiza el mensaje de loading sin cambiar el estado
   */
  updateMessage(message: string): void {
    this.loadingMessages.next(message);
  }

  /**
   * Muestra loading con un mensaje específico para diferentes operaciones
   */
  showWithMessage(operation: 'loading' | 'saving' | 'deleting' | 'uploading' | 'processing'): void {
    const messages = {
      loading: 'Cargando datos...',
      saving: 'Guardando cambios...',
      deleting: 'Eliminando...',
      uploading: 'Subiendo archivo...',
      processing: 'Procesando...'
    };

    this.show(messages[operation]);
  }

  /**
   * Muestra loading con un spinner personalizado
   */
  showWithSpinner(message: string = 'Cargando...'): void {
    this.show(message);
  }

  /**
   * Muestra loading con una barra de progreso
   */
  showWithProgress(message: string = 'Cargando...'): void {
    this.show(message);
  }
}

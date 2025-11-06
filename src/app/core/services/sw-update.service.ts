import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { NotificationService } from '../../shared/services/notification.service';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {
  private swUpdate = inject(SwUpdate);
  private notificationService = inject(NotificationService);

  constructor() {
    this.checkForUpdates();
    this.handleUpdates();
  }

  /**
   * Verifica si hay actualizaciones disponibles
   */
  checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      // Verificar actualizaciones cada 6 horas
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);
    }
  }

  /**
   * Maneja las actualizaciones del service worker
   */
  private handleUpdates(): void {
    if (this.swUpdate.isEnabled) {
      // Escuchar cuando hay una nueva versión disponible
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map(evt => evt.latestVersion)
        )
        .subscribe(() => {
          this.showUpdateNotification();
        });

      // Escuchar cuando hay un error en la actualización
      this.swUpdate.versionUpdates
        .pipe(filter(evt => evt.type === 'VERSION_INSTALLATION_FAILED'))
        .subscribe(() => {
          this.notificationService.error(
            'Error al actualizar la aplicación. Por favor, recarga la página.',
            'Error de Actualización'
          );
        });
    }
  }

  /**
   * Muestra notificación de actualización disponible
   */
  private showUpdateNotification(): void {
    this.notificationService.info(
      'Hay una nueva versión disponible. ¿Deseas actualizar ahora?',
      'Actualización Disponible',
      APP_CONSTANTS.NOTIFICATION_CONFIG.duration.long
    ).onAction().subscribe(() => {
      this.activateUpdate();
    });
  }

  /**
   * Activa la actualización
   */
  activateUpdate(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.activateUpdate().then(() => {
        // Limpiar caché del Service Worker antes de recargar
        this.clearServiceWorkerCache();
        
        this.notificationService.success(
          'Aplicación actualizada correctamente. Recargando...',
          'Actualización Exitosa'
        );
        
        // Recargar la página después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }).catch(error => {
        this.notificationService.error(
          'Error al activar la actualización. Por favor, recarga la página manualmente.',
          'Error de Actualización'
        );
      });
    }
  }

  /**
   * Limpia el caché del Service Worker
   */
  private clearServiceWorkerCache(): void {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.includes('ngsw') || cacheName.includes('api'))
            .map(cacheName => caches.delete(cacheName))
        );
      }).catch(error => {
        console.error('Error al limpiar caché del Service Worker:', error);
      });
    }
  }

  /**
   * Verifica si el service worker está habilitado
   */
  isServiceWorkerEnabled(): boolean {
    return this.swUpdate.isEnabled;
  }

  /**
   * Fuerza la verificación de actualizaciones
   */
  forceCheckForUpdate(): Promise<boolean> {
    if (this.swUpdate.isEnabled) {
      return this.swUpdate.checkForUpdate();
    }
    return Promise.resolve(false);
  }

  /**
   * Obtiene información sobre la versión actual
   */
  getCurrentVersion(): string {
    return '1.0.0'; // Versión actual de la aplicación
  }

  /**
   * Obtiene información sobre la última versión disponible
   */
  getLatestVersion(): string {
    return '1.0.0'; // Versión más reciente disponible
  }
}

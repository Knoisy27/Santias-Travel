import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  message: string;
  action?: string;
  duration?: number;
  type?: NotificationType;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: Partial<NotificationConfig> = {
    action: 'Cerrar',
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };

  show(config: NotificationConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };
    const panelClass = this.getPanelClass(finalConfig.type || 'info');

    return this.snackBar.open(
      finalConfig.message,
      finalConfig.action,
      {
        duration: finalConfig.duration,
        horizontalPosition: finalConfig.horizontalPosition,
        verticalPosition: finalConfig.verticalPosition,
        panelClass: [panelClass]
      }
    );
  }

  success(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action,
      duration,
      type: 'success'
    });
  }

  error(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action: action || 'Reintentar',
      duration: duration || 6000,
      type: 'error'
    });
  }

  warning(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action,
      duration: duration || 5000,
      type: 'warning'
    });
  }

  info(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action,
      duration,
      type: 'info'
    });
  }

  // Métodos específicos para acciones comunes
  showConnectivityError() {
    return this.error(
      'Error de conexión. Por favor, verifica tu internet.',
      'Reintentar',
      0 // No auto-dismiss
    );
  }

  showFormSaved() {
    return this.success(
      '¡Información guardada exitosamente!',
      'Ver',
      3000
    );
  }

  showFormError() {
    return this.error(
      'Error al guardar. Por favor, revisa los campos e inténtalo de nuevo.',
      'Revisar'
    );
  }

  showCopySuccess() {
    return this.success(
      'Información copiada al portapapeles',
      undefined,
      2000
    );
  }

  showFeatureComingSoon() {
    return this.info(
      'Esta característica estará disponible pronto',
      'Entendido',
      4000
    );
  }

  private getPanelClass(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'success-snackbar';
      case 'error':
        return 'error-snackbar';
      case 'warning':
        return 'warning-snackbar';
      case 'info':
        return 'info-snackbar';
      default:
        return 'info-snackbar';
    }
  }
}

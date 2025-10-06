import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotificationService } from '../../shared/services/notification.service';
import { APP_CONSTANTS } from '../constants/app.constants';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const retryAttempts = APP_CONSTANTS.API_CONFIG.retryAttempts;

  return next(req).pipe(
    retry(retryAttempts),
    catchError((error: HttpErrorResponse) => {
      return handleError(error, req, notificationService);
    })
  );
};

function handleError(error: HttpErrorResponse, req: any, notificationService: NotificationService) {
  let errorMessage = 'Ha ocurrido un error inesperado';
  let errorTitle = 'Error';
  let showNotification = true;

  // Determinar si es un error del cliente o del servidor
  if (error.error instanceof ErrorEvent) {
    // Error del lado del cliente
    errorMessage = `Error de conexión: ${error.error.message}`;
    errorTitle = 'Error de Conexión';
  } else {
    // Error del lado del servidor
    const { status, error: errorBody } = error;
    
    switch (status) {
      case 400:
        errorMessage = getBadRequestMessage(errorBody);
        errorTitle = 'Solicitud Inválida';
        break;
      case 401:
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        errorTitle = 'No Autorizado';
        handleUnauthorized();
        break;
      case 403:
        errorMessage = 'No tienes permisos para realizar esta acción.';
        errorTitle = 'Acceso Denegado';
        break;
      case 404:
        errorMessage = getNotFoundMessage(req.url);
        errorTitle = 'No Encontrado';
        break;
      case 408:
        errorMessage = 'La solicitud tardó demasiado tiempo. Inténtalo de nuevo.';
        errorTitle = 'Tiempo Agotado';
        break;
      case 429:
        errorMessage = 'Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.';
        errorTitle = 'Demasiadas Solicitudes';
        break;
      case 500:
        errorMessage = 'Error interno del servidor. Nuestro equipo ha sido notificado.';
        errorTitle = 'Error del Servidor';
        break;
      case 502:
      case 503:
      case 504:
        errorMessage = 'El servicio no está disponible temporalmente. Inténtalo más tarde.';
        errorTitle = 'Servicio No Disponible';
        break;
      default:
        errorMessage = `Error del servidor (${status}): ${getServerErrorMessage(errorBody)}`;
        errorTitle = 'Error del Servidor';
    }
  }

  // Log del error para debugging
  console.error('HTTP Error:', {
    url: req.url,
    method: req.method,
    status: error.status,
    message: errorMessage,
    error: error.error
  });

  // Mostrar notificación si es necesario
  if (showNotification) {
    notificationService.error(errorMessage, errorTitle);
  }

  return throwError(() => new Error(errorMessage));
}

function getBadRequestMessage(errorBody: any): string {
  if (errorBody?.message) {
    return errorBody.message;
  }
  if (errorBody?.errors && Array.isArray(errorBody.errors)) {
    return errorBody.errors.join(', ');
  }
  return 'La solicitud contiene datos inválidos.';
}

function getNotFoundMessage(url: string): string {
  if (url.includes('/destinations/')) {
    return 'El destino solicitado no existe o ha sido eliminado.';
  }
  if (url.includes('/testimonials/')) {
    return 'El testimonio solicitado no existe.';
  }
  if (url.includes('/agency/')) {
    return 'La información de la agencia no está disponible.';
  }
  return 'El recurso solicitado no existe.';
}

function getServerErrorMessage(errorBody: any): string {
  if (errorBody?.message) {
    return errorBody.message;
  }
  if (errorBody?.error) {
    return errorBody.error;
  }
  return 'Error interno del servidor';
}

function handleUnauthorized(): void {
  // Aquí podrías implementar lógica para redirigir al login
  // o limpiar tokens de autenticación
  // Por ahora, solo mostramos el mensaje
}
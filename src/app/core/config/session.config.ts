export const SESSION_CONFIG = {
  // Duración de la sesión (7 horas en milisegundos)
  SESSION_DURATION: 7 * 60 * 60 * 1000,
  
  // Tiempo límite de inactividad (1 hora en milisegundos)
  INACTIVITY_LIMIT: 60 * 60 * 1000,
  
  // Tiempo de advertencia antes del cierre (5 minutos en milisegundos)
  WARNING_TIME: 5 * 60 * 1000,
  
  // Endpoints que requieren validación de sesión
  VALIDATION_ENDPOINTS: ['/admin/**'],
  
  // Eventos que se consideran actividad del usuario
  ACTIVITY_EVENTS: [
    'mousedown', 
    'mousemove', 
    'keypress', 
    'scroll', 
    'touchstart', 
    'click'
  ],
  
  // Si se debe extender automáticamente la sesión al detectar actividad
  AUTO_EXTEND_ON_ACTIVITY: false,
  
  // Intervalo de validación en navegación (en milisegundos)
  NAVIGATION_VALIDATION_INTERVAL: 30000,
  
  // Mensajes de notificación
  MESSAGES: {
    INACTIVITY_WARNING: 'Tu sesión se cerrará en 5 minutos por inactividad',
    SESSION_EXPIRED: 'Sesión expirada por tiempo máximo (7 horas)',
    SESSION_INACTIVE: 'Sesión cerrada por inactividad',
    SESSION_INVALID: 'Sesión inválida o expirada',
    SESSION_EXTENDED: 'Sesión extendida por 1 hora más'
  }
};

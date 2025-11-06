// Cambiar esta variable para elegir entre dev y prod
const USE_PROD = true; // true = producción, false = desarrollo

// Configuración de desarrollo
const devConfig = {
  production: false,
  apiUrl: 'http://localhost:9090/api/v1',
  appName: 'Santias Travel',
  version: '1.0.0',
  enableAnalytics: false,
  enableLogging: true,
  mapboxToken: '', // Agregar token de Mapbox si se necesita
  googleMapsApiKey: '', // Agregar API key de Google Maps si se necesita
  session: {
    enabled: true,
    strictMode: false,
    logActivity: true
  }
};

// Configuración de producción
const prodConfig = {
  production: true,
  apiUrl: 'http://api.santiastravel.cloud:9090/api/v1',
  appName: 'Santias Travel',
  version: '1.0.0',
  enableAnalytics: true,
  enableLogging: false,
  mapboxToken: '', // Configurar en producción
  googleMapsApiKey: '', // Configurar en producción
  session: {
    enabled: true,
    strictMode: true,
    logActivity: false
  }
};

// Seleccionar configuración según USE_PROD
export const environment = USE_PROD ? prodConfig : devConfig;

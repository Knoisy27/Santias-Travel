/**
 * Constantes centralizadas de la aplicación
 * Contiene valores que se reutilizan en múltiples componentes
 */

export const APP_CONSTANTS = {
  // Información de la agencia
  AGENCY_INFO: {
    name: 'Santias Travel',
    description: 'Tu agencia de viajes de confianza',
    logo: '/assets/images/logo.png',
    email: 'informacion@santiastravel.cloud',
    phone: '+57 3042672662',
    whatsapp: '+57 3042672662',
    address: 'Carrera 34 # 26 - 61, Barrio Alvernia',
    city: 'Tuluá',
    country: 'Colombia',
    socialMedia: {
      facebook: 'https://facebook.com/santiastravel',
      instagram: 'https://instagram.com/santiastravel'
    },
    statistics: {
      yearsOfExperience: 3,
      destinationsAvailable: 50,
      happyClients: 106000,
      tripsCompleted: 5000
    },
    certifications: [] as any[]
  },

  // Mensajes de WhatsApp
  WHATSAPP_MESSAGES: {
    default: '¡Hola! Me interesa conocer más sobre sus servicios de viajes.',
    contact: '¡Hola! Me interesa contactar con ustedes.',
    newsletter: '¡Hola! Me interesa suscribirme al newsletter.',
    destination: '¡Hola! Me interesa conocer más sobre este destino.'
  },

  // Configuración de formularios
  FORM_CONFIG: {
    contact: {
      destinations: [
        { value: 'europa', label: 'Europa' },
        { value: 'asia', label: 'Asia' },
        { value: 'america', label: 'América' },
        { value: 'africa', label: 'África' },
        { value: 'oceania', label: 'Oceanía' }
      ],
      travelers: [
        { value: '1', label: '1 persona' },
        { value: '2', label: '2 personas' },
        { value: '3', label: '3 personas' },
        { value: '4', label: '4 personas' },
        { value: '5+', label: '5+ personas' }
      ]
    }
  },

  // Configuración de notificaciones
  NOTIFICATION_CONFIG: {
    duration: {
      short: 2000,
      medium: 4000,
      long: 6000
    }
  },

  // Rutas de la aplicación
  ROUTES: {
    home: '/',
    destinations: '/viajes-grupales',
        viajesATuMedida: '/viajes-a-tu-medida',
    about: '/sobre-nosotros',
    contact: '/contacto',
    terms: '/terminos',
    privacy: '/privacidad'
  },

  // Configuración de API
  API_CONFIG: {
    timeout: 30000, // 30 segundos
    retryAttempts: 3
  }
} as const;

// Tipos para las constantes
export type AgencyInfo = typeof APP_CONSTANTS.AGENCY_INFO;
export type WhatsAppMessages = typeof APP_CONSTANTS.WHATSAPP_MESSAGES;
export type FormConfig = typeof APP_CONSTANTS.FORM_CONFIG;
export type NotificationConfig = typeof APP_CONSTANTS.NOTIFICATION_CONFIG;
export type Routes = typeof APP_CONSTANTS.ROUTES;
export type ApiConfig = typeof APP_CONSTANTS.API_CONFIG;

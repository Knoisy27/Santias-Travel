export interface TripsSliderConfig {
  // Configuración general del slider
  general: {
    title: string;
    subtitle: string;
    emptyState: string;
    loadingSpinner: {
      diameter: number;
      strokeWidth: number;
    };
  };

  // Configuración de las cards de viajes
  tripCard: {
    buttonText: string;
    placeholderImage: string;
    maxDescriptionLength: number;
    cardWidth: number;
    cardPadding: number;
  };

  // Configuración de mock data
  mockData: {
    imagePath: string;
    maxCards: number; // Número máximo de mocks a mostrar cuando no hay viajes
    maxRealTrips: number; // Número máximo de viajes reales a mostrar
    defaultDescription: string;
    defaultEstado: string;
    defaultModificadoPor: string;
    nombrePattern: (index: number) => string;
  };

  // Configuración de navegación
  navigation: {
    leftButtonAriaLabel: string;
    rightButtonAriaLabel: string;
  };
}

export const TRIPS_SLIDER_CONFIG: TripsSliderConfig = {
  general: {
    title: 'Descubre a dónde puedes viajar',
    subtitle: 'Cada lugar tiene una historia esperando por ti. ¿Por cuál empezamos?',
    emptyState: 'No hay viajes disponibles en este momento.',
    loadingSpinner: {
      diameter: 50,
      strokeWidth: 4
    }
  },

  tripCard: {
    buttonText: 'Ver más detalles',
    placeholderImage: 'assets/images/placeholder-destination.jpg',
    maxDescriptionLength: 120,
    cardWidth: 336, // 320px (w-80) + 16px (px-4)
    cardPadding: 16
  },

  mockData: {
    imagePath: 'assets/images/mock-viajes/mock_viajes.png',
    maxCards: 1, // Solo 1 mock cuando no hay viajes
    maxRealTrips: 20, // Mostrar hasta 20 viajes reales
    defaultDescription: 'Descubre experiencias únicas diseñadas especialmente para ti. Desde destinos exóticos hasta aventuras culturales inolvidables.',
    defaultEstado: 'A',
    defaultModificadoPor: 'Sistema',
    nombrePattern: (index: number) => `Viaje Destacado ${index + 1}`
  },

  navigation: {
    leftButtonAriaLabel: 'Anterior',
    rightButtonAriaLabel: 'Siguiente'
  }
};


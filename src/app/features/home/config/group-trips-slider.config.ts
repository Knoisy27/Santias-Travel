export interface GroupTripsSliderConfig {
  general: {
    pretitle: string;
    title: string;
    subtitle: string;
  };
  slider: {
    cardWidth: number;
    cardGap: number;
    maxCards: number; // Número máximo de mocks a mostrar cuando no hay viajes
    maxRealTrips: number; // Número máximo de viajes reales a mostrar
    placeholderImage: string;
  };
  mockData: {
    nombrePattern: (index: number) => string;
    defaultDescription: string;
    defaultEstado: string;
    defaultModificadoPor: string;
    defaultImage: string;
  };
}

export const GROUP_TRIPS_SLIDER_CONFIG: GroupTripsSliderConfig = {
  general: {
    pretitle: '',
    title: 'Viajes grupales',
    subtitle: 'Descubre viajes con fechas definidas, acompañamiento experto y experiencias memorables que puedes compartir.'
  },
  slider: {
    cardWidth: 336,
    cardGap: 18,
    maxCards: 1, // Solo 1 mock cuando no hay viajes
    maxRealTrips: 20, // Mostrar hasta 20 viajes reales
    placeholderImage: 'assets/images/mock-viajes/mock_viajes.png'
  },
  mockData: {
    nombrePattern: (index: number) => `Experiencia grupal ${index + 1}`,
    defaultDescription: 'Vive aventuras compartidas con itinerarios balanceados y guías que te acompañan.',
    defaultEstado: 'A',
    defaultModificadoPor: 'Sistema',
    defaultImage: 'assets/images/mock-viajes/mock_viajes.png'
  }
};


export interface GroupTripsSliderConfig {
  general: {
    pretitle: string;
    title: string;
    subtitle: string;
  };
  slider: {
    cardWidth: number;
    cardGap: number;
    maxCards: number;
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
    pretitle: 'PRÓXIMOS',
    title: 'Viajes grupales',
    subtitle: 'Descubre viajes con fechas definidas, acompañamiento experto y experiencias memorables que puedes compartir.'
  },
  slider: {
    cardWidth: 320,
    cardGap: 18,
    maxCards: 6,
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


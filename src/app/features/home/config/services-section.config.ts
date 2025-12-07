export interface ServiceCard {
  title: string;
  description: string;
  icon: string; // Nombre del icono de Material Icons
}

export interface ServicesSectionConfig {
  preTitle: string;
  title: string;
  subtitle: string;
  services: ServiceCard[];
}

export const SERVICES_SECTION_CONFIG: ServicesSectionConfig = {
  preTitle: '¡Te puede incluir',
  title: 'Personaliza tu viaje como quieras',
  subtitle: 'No todos los viajeros buscan lo mismo, por eso con Santias Travel tú decides qué incluir en tu plan.',
  services: [
    {
      title: 'Tiquetes aéreos',
      description: 'Todo lo necesario para llegar a tu destino.',
      icon: 'flight'
    },
    {
      title: 'Traslados',
      description: 'Desde y hacia el aeropuerto, dentro del destino o donde lo necesites.',
      icon: 'airport_shuttle'
    },
    {
      title: 'Alimentación',
      description: 'Desde solo desayuno hasta planes todo incluido.',
      icon: 'restaurant'
    },
    {
      title: 'Tours y experiencias',
      description: 'Playas, cultura, aventura, historia, gastronomía y mucho más.',
      icon: 'explore'
    },
    {
      title: 'Alojamiento',
      description: 'Lugares acogedores para recargar energías en tu viaje.',
      icon: 'hotel'
    },
    {
      title: 'Asistencia médica',
      description: 'Siempre incluido, para que viajes con tranquilidad.',
      icon: 'medical_services'
    },
    {
      title: 'Formas de pago flexibles',
      description: 'A cuotas o de forma anticipada, adaptadas a tu presupuesto.',
      icon: 'payment'
    },
    {
      title: 'Atención personalizada por WhatsApp',
      description: 'Resuelve dudas y organiza tu viaje fácilmente.',
      icon: 'support_agent'
    }
  ]
};


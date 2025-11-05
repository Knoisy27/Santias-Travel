export interface AboutSectionConfig {
  // Configuración de estadísticas
  statistics: {
    yearsOfExperience: {
      value: number;
      title: string;
      description: string;
      icon: string;
    };
    destinations: {
      value: number;
      title: string;
      description: string;
      icon: string;
    };
    attention: {
      title: string;
      description: string;
      icon: string;
    };
    certification: {
      rnt: string;
      title: string;
      description: string;
      icon: string;
    };
  };

  // Configuración de certificaciones
  certifications: {
    whatsapp: {
      id: string;
      name: string;
      description: string;
      icon: string;
    };
    legal: {
      id: string;
      name: string;
      description: string;
      icon: string;
    };
  };
}

export const ABOUT_SECTION_CONFIG: AboutSectionConfig = {
  statistics: {
    yearsOfExperience: {
      value: 3,
      title: '+3 años de experiencia',
      description: 'Transformando sueños en realidad y momentos únicos.',
      icon: 'calendar'
    },
    destinations: {
      value: 15,
      title: '+15 destinos disponibles',
      description: 'Nacionales e internacionales esperando por ti.',
      icon: 'map'
    },
    attention: {
      title: 'Atención personalizada',
      description: 'Escríbenos, porque cada detalle está pensado para ti.',
      icon: 'chat'
    },
    certification: {
      rnt: '172280',
      title: 'Agencia certificada RNT 172280',
      description: 'Legalidad y confianza garantizadas.',
      icon: 'certificate'
    }
  },

  certifications: {
    whatsapp: {
      id: '1',
      name: 'Atención personalizada por WhatsApp 24/7',
      description: 'Hablas siempre con tu agente de confianza. Sin robots, con personas.',
      icon: 'whatsapp'
    },
    legal: {
      id: '2',
      name: 'Agencia legal certificada - (RNT 133939)',
      description: 'Viaja tranquilo. Somos una agencia registrada y respaldada por la ley.',
      icon: 'certificate'
    }
  }
};



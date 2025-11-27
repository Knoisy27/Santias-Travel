export interface HeroSectionConfig {
  // Configuración del título principal
  title: {
    main: string;
    highlight: string;
  };

  // Configuración de la descripción
  description: string;

  // Configuración del botón principal
  primaryButton: {
    text: string;
    icon: string;
    scrollTarget: string;
  };

  // Configuración de botones sociales
  socialButtons: {
    like: {
      title: string;
      icon: string;
    };
    comment: {
      title: string;
      icon: string;
    };
    share: {
      title: string;
      icon: string;
    };
    bookmark: {
      title: string;
      icon: string;
    };
  };

  // Configuración de WhatsApp
  whatsapp: {
    defaultMessage: string;
  };
}

export const HERO_SECTION_CONFIG: HeroSectionConfig = {
  title: {
    main: 'SOMOS MÁS QUE UNA',
    highlight: 'AGENCIA DE VIAJES'
  },

  description: 'Contamos con más de 15 destinos nacionales e internacionales para que vivas experiencias únicas. Viajes seguros y recuerdos inolvidables.',

  primaryButton: {
    text: 'EXPLORAR DESTINOS',
    icon: 'explore',
    scrollTarget: 'experiences'
  },

  socialButtons: {
    like: {
      title: 'Me gusta',
      icon: 'favorite'
    },
    comment: {
      title: 'Comentar',
      icon: 'comment'
    },
    share: {
      title: 'Compartir',
      icon: 'share'
    },
    bookmark: {
      title: 'Guardar',
      icon: 'bookmark'
    }
  },

  whatsapp: {
    defaultMessage: '¡Hola! Me interesa conocer más sobre sus destinos de viaje.'
  }
};




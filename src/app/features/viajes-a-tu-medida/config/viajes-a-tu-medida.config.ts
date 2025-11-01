export interface ViajesATuMedidaConfig {
  // Configuración del componente padre (lista)
  list: {
    title: string;
    subtitle: string;
    emptyState: string;
    buttonText: string;
    mockTrip: {
      title: string;
      description: string;
      badge: string;
    };
  };

  // Configuración del componente hijo (detalle)
  detail: {
    loading: {
      message: string;
      spinnerDiameter: number;
      spinnerStrokeWidth: number;
    };
    error: {
      title: string;
      message: string;
      buttonText: string;
    };
    content: {
      prefixTitle: string;
      sections: {
        price: {
          label: string;
        };
        dates: {
          label: string;
          icon: string;
        };
        includes: {
          title: string;
          color: string;
        };
        excludes: {
          title: string;
          color: string;
        };
        itinerary: {
          title: string;
          color: string;
        };
        suggestions: {
          title: string;
          color: string;
        };
      };
      whatsappButton: {
        text: string;
      };
    };
    messages: {
      invalidId: string;
      noIdProvided: string;
      loadError: string;
      whatsappMessage: (nombre: string, descripcion: string, precio?: string, fechas?: string) => string;
    };
  };

  // Configuración de errores y validaciones
  errors: {
    edit: {
      noId: string;
      duration: number;
    };
    delete: {
      noId: string;
      confirmMessage: (nombre: string) => string;
      success: string;
      forbidden: string;
      notFound: string;
      serverError: string;
      connectionError: string;
      duration: number;
      longDuration: number;
    };
  };
}

export const VIAJES_A_TU_MEDIDA_CONFIG: ViajesATuMedidaConfig = {
  list: {
    title: 'Viajes a tu Medida',
    subtitle: 'Descubre experiencias únicas diseñadas especialmente para ti',
    emptyState: 'No hay viajes disponibles en este momento.',
    buttonText: 'Más detalles',
    mockTrip: {
      title: 'Experiencia de Viaje Personalizada',
      description: 'Nuestro sistema está temporalmente fuera de servicio. Mientras tanto, imagina tu viaje perfecto: desde destinos exóticos hasta experiencias culturales únicas, todo diseñado especialmente para ti.',
      badge: 'Modo Demo'
    }
  },

  detail: {
    loading: {
      message: 'Cargando viaje...',
      spinnerDiameter: 60,
      spinnerStrokeWidth: 4
    },
    error: {
      title: 'No se pudo cargar el viaje',
      message: 'No se pudo cargar el viaje',
      buttonText: 'Volver a viajes'
    },
    content: {
      prefixTitle: 'Viaja a',
      sections: {
        price: {
          label: 'Precio'
        },
        dates: {
          label: 'Fechas',
          icon: 'calendar_today'
        },
        includes: {
          title: 'Incluye',
          color: 'green'
        },
        excludes: {
          title: 'No Incluye',
          color: 'red'
        },
        itinerary: {
          title: 'Itinerario',
          color: 'blue'
        },
        suggestions: {
          title: 'Sugerencias',
          color: 'amber'
        }
      },
      whatsappButton: {
        text: 'Consultar más información'
      }
    },
    messages: {
      invalidId: 'ID de viaje inválido',
      noIdProvided: 'ID de viaje no proporcionado',
      loadError: 'Error al cargar el viaje. Redirigiendo...',
      whatsappMessage: (nombre: string, descripcion: string, precio?: string, fechas?: string) => {
        let mensaje = `¡Hola! Me interesa conocer más información sobre el viaje "${nombre}".\n\n`;
        mensaje += `Descripción: ${descripcion}\n\n`;
        if (precio) mensaje += `Precio: ${precio}\n\n`;
        mensaje += '¿Podrían brindarme más detalles?';
        return mensaje;
      }
    }
  },

  errors: {
    edit: {
      noId: 'Error: No se puede editar un viaje sin ID',
      duration: 3000
    },
    delete: {
      noId: 'Error: No se puede eliminar un viaje sin ID',
      confirmMessage: (nombre: string) => `¿Estás seguro de que deseas eliminar el viaje "${nombre}"?`,
      success: 'Viaje eliminado exitosamente',
      forbidden: 'No tienes permisos para eliminar este viaje.',
      notFound: 'El viaje no fue encontrado.',
      serverError: 'Error interno del servidor. Por favor, intenta más tarde o contacta al administrador.',
      connectionError: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      duration: 3000,
      longDuration: 5000
    }
  }
};


export function getPrerenderParams(): { route: string }[] {
  return [
    // Rutas estáticas principales
    { route: '/' },
    { route: '/destinos' },
    { route: '/viajes-personalizados' },
    { route: '/sobre-nosotros' },
    { route: '/contacto' },
    { route: '/terminos' },
    { route: '/privacidad' },
    
    // Rutas dinámicas de destinos (basadas en datos mock)
    { route: '/destino/1' }, // París, Francia
    { route: '/destino/2' }, // Tokio, Japón
    { route: '/destino/3' }, // Nueva York, EE. UU.
    { route: '/destino/4' }, // Roma, Italia
    { route: '/destino/5' }, // Machu Picchu, Perú
    { route: '/destino/6' }  // Bangkok, Tailandia
  ];
}

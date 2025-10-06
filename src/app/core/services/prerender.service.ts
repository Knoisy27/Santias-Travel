import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrerenderService {

  /**
   * Obtiene los IDs de destinos para prerendering
   * Basado en los datos mock que tenemos
   */
  getDestinationIds(): string[] {
    return ['1', '2', '3', '4', '5', '6']; // IDs de los destinos mock
  }

  /**
   * Genera rutas de prerendering para destinos
   */
  generateDestinationRoutes(): { route: string }[] {
    return this.getDestinationIds().map(id => ({ route: `/destino/${id}` }));
  }

  /**
   * Obtiene todas las rutas estáticas
   */
  getStaticRoutes(): { route: string }[] {
    return [
      { route: '/' },
      { route: '/destinos' },
      { route: '/viajes-personalizados' },
      { route: '/sobre-nosotros' },
      { route: '/contacto' },
      { route: '/terminos' },
      { route: '/privacidad' }
    ];
  }

  /**
   * Obtiene todas las rutas para prerendering
   */
  getAllRoutes(): { route: string }[] {
    return [
      ...this.getStaticRoutes(),
      ...this.generateDestinationRoutes()
    ];
  }
}

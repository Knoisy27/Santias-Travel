import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrerenderService {

  /**
   * Obtiene todas las rutas estáticas
   */
  getStaticRoutes(): { route: string }[] {
    return [
      { route: '/' },
      { route: '/viajes-grupales' },
          { route: '/viajes-a-tu-medida' },
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
      ...this.getStaticRoutes()
    ];
  }
}

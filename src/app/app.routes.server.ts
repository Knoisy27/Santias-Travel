import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'destinos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'viajes-personalizados',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'sobre-nosotros',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'contacto',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'terminos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'privacidad',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];

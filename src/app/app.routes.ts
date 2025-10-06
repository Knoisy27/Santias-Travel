import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/components/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/components/home/home.component').then(m => m.HomeComponent),
        data: { preload: true } // Preload para la página principal
      },
      {
        path: 'destinos',
        loadComponent: () => import('./features/destinations/components/destinations-list/destinations-list.component').then(m => m.DestinationsListComponent),
        data: { preload: true } // Preload para página importante
      },
      // {
      //   path: 'destino/:id',
      //   loadComponent: () => import('./features/destinations/components/destination-detail/destination-detail.component').then(m => m.DestinationDetailComponent),
      //   data: { skipPrerender: true }
      // },
      {
        path: 'viajes-personalizados',
        loadComponent: () => import('./features/custom-trips/components/custom-trips/custom-trips.component').then(m => m.CustomTripsComponent)
      },
      {
        path: 'sobre-nosotros',
        loadComponent: () => import('./features/about/components/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./features/contact/components/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'terminos',
        loadComponent: () => import('./features/legal/components/terms/terms.component').then(m => m.TermsComponent)
      },
      {
        path: 'privacidad',
        loadComponent: () => import('./features/legal/components/privacy/privacy.component').then(m => m.PrivacyComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

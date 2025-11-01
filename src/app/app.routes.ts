import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

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
        path: 'viajes-a-tu-medida',
        loadComponent: () => import('./features/viajes-a-tu-medida/components/viajes-a-tu-medida/viajes-a-tu-medida.component').then(m => m.ViajesATuMedidaComponent)
      },
      {
        path: 'viajes-a-tu-medida/:id',
        loadComponent: () => import('./features/viajes-a-tu-medida/components/viajes-a-tu-medida-detalle/viajes-a-tu-medida-detalle.component').then(m => m.ViajesATuMedidaDetalleComponent)
      },
      {
        path: 'viajes-grupales',
        loadComponent: () => import('./features/viajes-grupales/components/viajes-grupales/viajes-grupales.component').then(m => m.ViajesGrupalesComponent),
        data: { preload: true } // Preload para página importante
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
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'AGENT'] },
        children: [
          {
            path: 'viajes',
            loadComponent: () => import('./features/trips-admin/components/trips-admin.component').then(m => m.TripsAdminComponent),
            data: { skipPrerender: true }
          },
              {
                path: 'viajes/viajes-grupales',
                loadComponent: () => import('./features/trips-admin/components/viajes-grupales-form/viajes-grupales-form.component').then(m => m.ViajesGrupalesFormComponent),
                data: { skipPrerender: true }
              },
              {
                path: 'viajes/viajes-grupales/:id',
                loadComponent: () => import('./features/trips-admin/components/viajes-grupales-form/viajes-grupales-form.component').then(m => m.ViajesGrupalesFormComponent),
                data: { skipPrerender: true }
              },
              {
                path: 'viajes/viajes-individuales',
                loadComponent: () => import('./features/trips-admin/components/viajes-individuales-form/viajes-individuales-form.component').then(m => m.ViajesIndividualesFormComponent),
                data: { skipPrerender: true }
              },
              {
                path: 'viajes/viajes-individuales/:id',
                loadComponent: () => import('./features/trips-admin/components/viajes-individuales-form/viajes-individuales-form.component').then(m => m.ViajesIndividualesFormComponent),
                data: { skipPrerender: true }
              }
        ]
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent),
    data: { skipPrerender: true }
  },
  {
    path: 'backend-test',
    loadComponent: () => import('./features/auth/components/backend-test/backend-test.component').then(m => m.BackendTestComponent),
    data: { skipPrerender: true }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

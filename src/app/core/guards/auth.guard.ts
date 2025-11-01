import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionManagerService } from '../services/session-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private sessionManager = inject(SessionManagerService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('Usuario no autenticado, redirigiendo al login');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    // Validar sesión en navegación (funciona en rutas hijas también)
    this.sessionManager.validateOnNavigation();

    // Verificar roles requeridos si están especificados en la ruta
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.authService.user()?.role;
      
      if (!userRole || !requiredRoles.includes(userRole.toUpperCase())) {
        console.log(`Usuario sin permisos. Rol requerido: ${requiredRoles.join(' o ')}, Rol actual: ${userRole}`);
        this.router.navigate(['/'], { 
          queryParams: { error: 'unauthorized' } 
        });
        return false;
      }
    }

    return true;
  }
}

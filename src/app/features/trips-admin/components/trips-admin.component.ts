import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'app-trips-admin',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './trips-admin.component.html',
  styleUrl: './trips-admin.component.scss'
})
export class TripsAdminComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    // Verificar si hay un error de autorización en los query params
    const hasError = this.route.snapshot.queryParams['error'];
    if (hasError === 'unauthorized') {
      console.log('Acceso no autorizado a la página de administración');
    }
  }

  get currentUser() {
    return this.authService.user();
  }

  get isAuthorized() {
    const user = this.currentUser;
    return user && (user.role === 'admin' || user.role === 'agent');
  }
}

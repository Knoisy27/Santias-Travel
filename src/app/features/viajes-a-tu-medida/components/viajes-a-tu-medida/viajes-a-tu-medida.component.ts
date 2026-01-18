import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripsService, ViajeIndividual } from '../../../../core/services/trips.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SEOService } from '../../../../core/services/seo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { VIAJES_A_TU_MEDIDA_CONFIG } from '../../config/viajes-a-tu-medida.config';

@Component({
  selector: 'app-viajes-a-tu-medida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viajes-a-tu-medida.component.html',
  styleUrl: './viajes-a-tu-medida.component.scss'
})
export class ViajesATuMedidaComponent implements OnInit, OnDestroy {
  viajes: ViajeIndividual[] = [];
  showMockTrip = true;
  private destroy$ = new Subject<void>();
  readonly config = VIAJES_A_TU_MEDIDA_CONFIG;
  
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private seoService = inject(SEOService);

  constructor(
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Actualizar meta tags SEO
    this.seoService.updateCustomTripsPageMeta();
    
    this.cargarViajes();
  }

  cargarViajes() {
    this.tripsService.getViajesIndividuales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (viajes) => {
          this.viajes = viajes || [];
          this.showMockTrip = this.viajes.length === 0;
          
          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error al cargar viajes:', error);
          this.showMockTrip = true;
          this.viajes = [];
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByViaje(index: number, viaje: ViajeIndividual): number {
    return viaje?.id ?? index;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get canDelete(): boolean {
    return this.isAuthenticated && (this.authService.isAdmin() || this.authService.isAgent());
  }

  get canEdit(): boolean {
    return this.isAuthenticated && (this.authService.isAdmin() || this.authService.isAgent());
  }

  editarViaje(viaje: ViajeIndividual, event: Event): void {
    event.stopPropagation();
    
    if (!viaje.id) {
      this.snackBar.open(this.config.errors.edit.noId, 'Cerrar', { duration: this.config.errors.edit.duration });
      return;
    }

    this.router.navigate(['/admin/viajes/viajes-individuales', viaje.id]);
  }

  eliminarViaje(viaje: ViajeIndividual, event: Event): void {
    event.stopPropagation();
    
    if (!viaje.id) {
      this.snackBar.open(this.config.errors.delete.noId, 'Cerrar', { duration: this.config.errors.delete.duration });
      return;
    }

    const confirmacion = confirm(this.config.errors.delete.confirmMessage(viaje.nombre));
    
    if (!confirmacion) {
      return;
    }

    this.tripsService.deleteViajeIndividual(viaje.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open(this.config.errors.delete.success, 'Cerrar', { duration: this.config.errors.delete.duration });
          this.viajes = this.viajes.filter(v => v.id !== viaje.id);
          
          if (this.viajes.length === 0) {
            this.showMockTrip = true;
          }
          
          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error al eliminar viaje:', error);
          let errorMessage = this.config.errors.delete.serverError;
          
          if (error.status === 403) {
            errorMessage = this.config.errors.delete.forbidden;
          } else if (error.status === 404) {
            errorMessage = this.config.errors.delete.notFound;
          } else if (error.status === 500) {
            const errorDetail = error?.error?.message || error?.message;
            if (errorDetail && errorDetail !== 'Error interno del servidor. Nuestro equipo ha sido notificado.') {
              errorMessage = `Error del servidor: ${errorDetail}`;
            } else {
              errorMessage = this.config.errors.delete.serverError;
            }
          } else if (error.status === 0) {
            errorMessage = this.config.errors.delete.connectionError;
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', { duration: this.config.errors.delete.longDuration });
        }
      });
  }

  verDetalles(viaje: ViajeIndividual): void {
    if (viaje?.id) {
      this.router.navigate(['/viajes-a-tu-medida', viaje.id]);
    }
  }

}


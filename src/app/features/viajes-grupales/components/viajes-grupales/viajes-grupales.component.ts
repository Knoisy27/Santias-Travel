import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService, ViajeGrupal } from '../../../../core/services/trips.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SEOService } from '../../../../core/services/seo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { VIAJES_GRUPALES_CONFIG } from '../../config/viajes-grupales.config';

@Component({
  selector: 'app-viajes-grupales',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './viajes-grupales.component.html',
  styleUrl: './viajes-grupales.component.scss'
})
export class ViajesGrupalesComponent implements OnInit, OnDestroy {
  viajes: ViajeGrupal[] = [];
  showMockTrip = true;
  private destroy$ = new Subject<void>();
  readonly config = VIAJES_GRUPALES_CONFIG;

  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private seoService = inject(SEOService);

  constructor(
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit() {
    // Actualizar meta tags SEO
    this.seoService.updateGroupTripsPageMeta();
    
    this.cargarViajes();
  }

  cargarViajes() {
    this.tripsService.getViajesGrupales()
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
          console.error('Error al cargar viajes grupales:', error);
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

  trackByViaje(index: number, viaje: ViajeGrupal): number {
    return viaje?.idVigr ?? index;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    const fechaObj = new Date(fecha);
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const dia = fechaObj.getDate();
    const mes = meses[fechaObj.getMonth()];

    return `${dia} de ${mes}`;
  }

  formatearRangoFechas(fechaInicio: string, fechaFin: string): string {
    if (!fechaInicio || !fechaFin) return '';
    return `${this.formatearFecha(fechaInicio)} al ${this.formatearFecha(fechaFin)}`;
  }

  formatearPrecio(valor: number): string {
    if (!valor) return '$0';
    return `$${valor.toLocaleString('es-CO')}`;
  }

  verMasDetalles(viaje: ViajeGrupal) {
    if (viaje?.idVigr) {
      this.router.navigate(['/viajes-grupales', viaje.idVigr]);
    }
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

  editarViaje(viaje: ViajeGrupal, event: Event): void {
    event.stopPropagation();
    
    if (!viaje.idVigr) {
      this.snackBar.open(this.config.errors.edit.noId, 'Cerrar', { duration: this.config.errors.edit.duration });
      return;
    }

    this.router.navigate(['/admin/viajes/viajes-grupales', viaje.idVigr]);
  }

  eliminarViaje(viaje: ViajeGrupal, event: Event): void {
    event.stopPropagation();
    
    if (!viaje.idVigr) {
      this.snackBar.open(this.config.errors.delete.noId, 'Cerrar', { duration: this.config.errors.delete.duration });
      return;
    }

    const confirmacion = confirm(this.config.errors.delete.confirmMessage(viaje.nombre));
    
    if (!confirmacion) {
      return;
    }

    this.tripsService.deleteViajeGrupal(viaje.idVigr)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open(this.config.errors.delete.success, 'Cerrar', { duration: this.config.errors.delete.duration });
          this.viajes = this.viajes.filter(v => v.idVigr !== viaje.idVigr);
          
          if (this.viajes.length === 0) {
            this.showMockTrip = true;
          }
          
          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error al eliminar viaje grupal:', error);
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
}

import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripsService, ViajeIndividual } from '../../../../core/services/trips.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

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
  
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor(
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
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
      this.snackBar.open('Error: No se puede editar un viaje sin ID', 'Cerrar', { duration: 3000 });
      return;
    }

    this.router.navigate(['/admin/viajes/viajes-individuales', viaje.id]);
  }

  eliminarViaje(viaje: ViajeIndividual, event: Event): void {
    event.stopPropagation();
    
    if (!viaje.id) {
      this.snackBar.open('Error: No se puede eliminar un viaje sin ID', 'Cerrar', { duration: 3000 });
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el viaje "${viaje.nombre}"?`);
    
    if (!confirmacion) {
      return;
    }

    this.tripsService.deleteViajeIndividual(viaje.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Viaje eliminado exitosamente', 'Cerrar', { duration: 3000 });
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
          let errorMessage = 'Error al eliminar el viaje. Intenta nuevamente.';
          
          if (error.status === 403) {
            errorMessage = 'No tienes permisos para eliminar este viaje.';
          } else if (error.status === 404) {
            errorMessage = 'El viaje no fue encontrado.';
          } else if (error.status === 500) {
            // Intentar obtener mensaje más específico del error
            const errorDetail = error?.error?.message || error?.message;
            if (errorDetail && errorDetail !== 'Error interno del servidor. Nuestro equipo ha sido notificado.') {
              errorMessage = `Error del servidor: ${errorDetail}`;
            } else {
              errorMessage = 'Error interno del servidor. Por favor, intenta más tarde o contacta al administrador.';
            }
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
  }

  verDetalles(viaje: ViajeIndividual): void {
    if (viaje?.id) {
      this.router.navigate(['/viajes-a-tu-medida', viaje.id]);
    }
  }

}


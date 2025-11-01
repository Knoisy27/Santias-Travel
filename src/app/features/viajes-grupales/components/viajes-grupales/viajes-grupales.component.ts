import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService, ViajeGrupal } from '../../../../core/services/trips.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viajes-grupales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viajes-grupales.component.html',
  styleUrl: './viajes-grupales.component.scss'
})
export class ViajesGrupalesComponent implements OnInit, OnDestroy {
  viajes: ViajeGrupal[] = [];
  showMockTrip = true;
  private destroy$ = new Subject<void>();

  constructor(
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit() {
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
}

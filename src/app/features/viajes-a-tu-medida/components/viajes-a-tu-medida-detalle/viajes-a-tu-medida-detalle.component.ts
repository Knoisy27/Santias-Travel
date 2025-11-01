import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TripsService, ViajeIndividual } from '../../../../core/services/trips.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-viajes-a-tu-medida-detalle',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatProgressSpinnerModule],
  templateUrl: './viajes-a-tu-medida-detalle.component.html',
  styleUrl: './viajes-a-tu-medida-detalle.component.scss'
})
export class ViajesATuMedidaDetalleComponent implements OnInit, OnDestroy {
  viaje: ViajeIndividual | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private snackBar = inject(MatSnackBar);
  private utilsService = inject(UtilsService);

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const idNumber = parseInt(id, 10);
      if (!isNaN(idNumber)) {
        this.cargarViaje(idNumber);
      } else {
        this.snackBar.open('ID de viaje inválido', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/viajes-a-tu-medida']);
      }
    } else {
      this.snackBar.open('ID de viaje no proporcionado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/viajes-a-tu-medida']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarViaje(id: number): void {
    this.isLoading = true;
    this.tripsService.getViajeIndividual(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (viaje) => {
          this.viaje = viaje;
          this.isLoading = false;
          
          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error al cargar viaje:', error);
          this.isLoading = false;
          this.snackBar.open('Error al cargar el viaje. Redirigiendo...', 'Cerrar', { duration: 3000 });
          
          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
          
          setTimeout(() => {
            this.router.navigate(['/viajes-a-tu-medida']);
          }, 2000);
        }
      });
  }

  formatearPrecio(valor: number): string {
    if (!valor) return '$0';
    return `$${valor.toLocaleString('es-CO')}`;
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '';
    const fechaObj = new Date(fechaStr);
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
    const inicio = this.formatearFecha(fechaInicio);
    const fin = this.formatearFecha(fechaFin);
    return `${inicio} al ${fin}`;
  }

  volverAViajes(): void {
    this.router.navigate(['/viajes-a-tu-medida']);
  }

  consultarInformacion(): void {
    if (!this.viaje) return;

    const mensaje = `¡Hola! Me interesa conocer más información sobre el viaje "${this.viaje.nombre}".\n\n` +
                   `Descripción: ${this.viaje.descripcion}\n\n` +
                   (this.viaje.valor ? `Precio: ${this.formatearPrecio(this.viaje.valor)}\n\n` : '') +
                   '¿Podrían brindarme más detalles?';

    const whatsappNumber = APP_CONSTANTS.AGENCY_INFO.whatsapp;
    this.utilsService.openWhatsApp(whatsappNumber, mensaje);
  }
}

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
import { VIAJES_A_TU_MEDIDA_CONFIG } from '../../config/viajes-a-tu-medida.config';

import { CTA_SECTION_CONFIG } from '../../../home/config/cta-section.config';
import { ServicesSectionComponent } from '../../../home/components/services-section/services-section.component';
import { CtaSectionComponent } from '../../../home/components/cta-section/cta-section.component';

@Component({
  selector: 'app-viajes-a-tu-medida-detalle',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatProgressSpinnerModule, ServicesSectionComponent, CtaSectionComponent],
  templateUrl: './viajes-a-tu-medida-detalle.component.html',
  styleUrl: './viajes-a-tu-medida-detalle.component.scss'
})
export class ViajesATuMedidaDetalleComponent implements OnInit, OnDestroy {
  viaje: ViajeIndividual | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();
  readonly config = VIAJES_A_TU_MEDIDA_CONFIG;
  readonly ctaConfig = CTA_SECTION_CONFIG;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private snackBar = inject(MatSnackBar);
  private utilsService = inject(UtilsService);

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const idNumber = parseInt(id, 10);
      if (!isNaN(idNumber)) {
        this.cargarViaje(idNumber);
      } else {
        this.snackBar.open(this.config.detail.messages.invalidId, 'Cerrar', { duration: this.config.errors.edit.duration });
        this.router.navigate(['/viajes-a-tu-medida']);
      }
    } else {
      this.snackBar.open(this.config.detail.messages.noIdProvided, 'Cerrar', { duration: this.config.errors.edit.duration });
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
          this.snackBar.open(this.config.detail.messages.loadError, 'Cerrar', { duration: this.config.errors.edit.duration });

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

    const precio = this.viaje.valor ? this.formatearPrecio(this.viaje.valor) : undefined;
    const mensaje = this.config.detail.messages.whatsappMessage(
      this.viaje.nombre,
      this.viaje.descripcion,
      precio
    );

    const whatsappNumber = APP_CONSTANTS.AGENCY_INFO.whatsapp;
    this.utilsService.openWhatsApp(whatsappNumber, mensaje);
  }
}

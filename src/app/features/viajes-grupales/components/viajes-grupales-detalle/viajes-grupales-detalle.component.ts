import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TripsService, ViajeGrupal } from '../../../../core/services/trips.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { VIAJES_GRUPALES_CONFIG } from '../../config/viajes-grupales.config';

@Component({
  selector: 'app-viajes-grupales-detalle',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatProgressSpinnerModule],
  templateUrl: './viajes-grupales-detalle.component.html',
  styleUrl: './viajes-grupales-detalle.component.scss'
})
export class ViajesGrupalesDetalleComponent implements OnInit, OnDestroy {
  viaje: ViajeGrupal | null = null;
  isLoading = true;
  private destroy$ = new Subject<void>();
  readonly config = VIAJES_GRUPALES_CONFIG;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private snackBar = inject(MatSnackBar);
  private utilsService = inject(UtilsService);
  private sanitizer = inject(DomSanitizer);

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
        this.snackBar.open(this.config.detail.messages.invalidId, 'Cerrar', { duration: this.config.errors.edit.duration });
        this.router.navigate(['/viajes-grupales']);
      }
    } else {
      this.snackBar.open(this.config.detail.messages.noIdProvided, 'Cerrar', { duration: this.config.errors.edit.duration });
      this.router.navigate(['/viajes-grupales']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarViaje(id: number): void {
    this.isLoading = true;
    this.tripsService.getViajeGrupal(id)
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
          console.error('Error al cargar viaje grupal:', error);
          this.isLoading = false;
          this.snackBar.open(this.config.detail.messages.loadError, 'Cerrar', { duration: this.config.errors.edit.duration });
          
          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
          
          setTimeout(() => {
            this.router.navigate(['/viajes-grupales']);
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
    this.router.navigate(['/viajes-grupales']);
  }

  consultarInformacion(): void {
    if (!this.viaje) return;

    const precio = this.viaje.valor ? this.formatearPrecio(this.viaje.valor) : undefined;
    const fechas = (this.viaje.fechaInicio && this.viaje.fechaFin) 
      ? this.formatearRangoFechas(this.viaje.fechaInicio, this.viaje.fechaFin) 
      : undefined;
    
    const mensaje = this.config.detail.messages.whatsappMessage(
      this.viaje.nombre,
      this.viaje.descripcion,
      precio,
      fechas
    );

    const whatsappNumber = APP_CONSTANTS.AGENCY_INFO.whatsapp;
    this.utilsService.openWhatsApp(whatsappNumber, mensaje);
  }

  // Métodos para sanitizar HTML
  sanitizeHtml(html: string | undefined): SafeHtml {
    if (!html) return '';
    // Usar bypassSecurityTrustHtml para permitir renderizado de HTML desde el editor
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getIncluyeHtml(): SafeHtml {
    return this.sanitizeHtml(this.viaje?.incluye);
  }

  getNoIncluyeHtml(): SafeHtml {
    return this.sanitizeHtml(this.viaje?.noIncluye);
  }

  getItinerarioHtml(): SafeHtml {
    return this.sanitizeHtml(this.viaje?.itinerario);
  }

  getSugerenciasHtml(): SafeHtml {
    return this.sanitizeHtml(this.viaje?.sugerencias);
  }
}


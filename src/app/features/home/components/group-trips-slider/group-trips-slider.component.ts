import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripsService, ViajeGrupal } from '../../../../core/services/trips.service';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Subject, takeUntil } from 'rxjs';
import { GROUP_TRIPS_SLIDER_CONFIG } from '../../config/group-trips-slider.config';

@Component({
  selector: 'app-group-trips-slider',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './group-trips-slider.component.html',
  styleUrl: './group-trips-slider.component.scss'
})
export class GroupTripsSliderComponent implements OnInit, OnDestroy {
  viajes = signal<ViajeGrupal[]>([]);
  displayViajes = signal<ViajeGrupal[]>([]);
  currentIndex = signal(0);
  isLoading = signal(true);
  readonly config = GROUP_TRIPS_SLIDER_CONFIG;
  private destroy$ = new Subject<void>();

  private tripsService = inject(TripsService);
  private router = inject(Router);

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.cargarViajes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarViajes(): void {
    this.isLoading.set(true);
    this.tripsService.getViajesGrupales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (viajes) => {
          const viajesOrdenados = (viajes || [])
            .sort((a, b) => {
              const fechaA = a.fechaInicio ? new Date(a.fechaInicio).getTime() : 0;
              const fechaB = b.fechaInicio ? new Date(b.fechaInicio).getTime() : 0;
              return fechaA - fechaB;
            })
            .slice(0, this.config.slider.maxCards);

          const viajesConMocks = this.completarConMocks(viajesOrdenados);

          this.viajes.set(viajesConMocks);
          this.displayViajes.set([...viajesConMocks, ...viajesConMocks, ...viajesConMocks]);
          this.currentIndex.set(viajesConMocks.length);
          this.isLoading.set(false);

          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error al cargar viajes grupales para el slider:', error);
          const viajesMocks = this.completarConMocks([]);
          this.viajes.set(viajesMocks);
          this.displayViajes.set([...viajesMocks, ...viajesMocks, ...viajesMocks]);
          this.currentIndex.set(viajesMocks.length);
          this.isLoading.set(false);

          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        }
      });
  }

  private completarConMocks(viajes: ViajeGrupal[]): ViajeGrupal[] {
    const mocksNecesarios = this.config.slider.maxCards - viajes.length;
    if (mocksNecesarios <= 0) return viajes;

    const mocks: ViajeGrupal[] = [];
    for (let i = 0; i < mocksNecesarios; i++) {
      mocks.push({
        idVigr: undefined,
        nombre: this.config.mockData.nombrePattern(i),
        descripcion: this.config.mockData.defaultDescription,
        descripcionCorta: this.config.mockData.defaultDescription,
        valor: 0,
        imagenUrl: this.config.mockData.defaultImage,
        imagenListadoUrl: this.config.mockData.defaultImage,
        fechaInicio: '',
        fechaFin: '',
        incluye: '',
        itinerario: '',
        noIncluye: '',
        sugerencias: '',
        estado: this.config.mockData.defaultEstado,
        modificadoPor: this.config.mockData.defaultModificadoPor
      });
    }

    return [...viajes, ...mocks];
  }

  moverIzquierda(): void {
    if (this.viajes().length === 0) return;

    const totalViajes = this.viajes().length;
    let nuevoIndex = this.currentIndex() - 1;

    if (nuevoIndex < totalViajes) {
      nuevoIndex = totalViajes * 2 - 1;
    }

    this.currentIndex.set(nuevoIndex);
  }

  moverDerecha(): void {
    if (this.viajes().length === 0) return;

    const totalViajes = this.viajes().length;
    let nuevoIndex = this.currentIndex() + 1;

    if (nuevoIndex >= totalViajes * 2) {
      nuevoIndex = totalViajes;
    }

    this.currentIndex.set(nuevoIndex);
  }

  irADetalle(viaje: ViajeGrupal): void {
    if (viaje?.idVigr) {
      this.router.navigate(['/viajes-grupales', viaje.idVigr]);
    }
  }

  get transformValue(): string {
    const cardWidth = this.config.slider.cardWidth;
    const offset = this.currentIndex() * cardWidth;
    return `translateX(-${offset}px)`;
  }

  getCardImage(viaje: ViajeGrupal): string {
    return viaje.imagenListadoUrl || viaje.imagenUrl || this.config.slider.placeholderImage;
  }

  getCardDescription(viaje: ViajeGrupal): string {
    return viaje.descripcionCorta?.trim() || viaje.descripcion || '';
  }

  formatPrice(valor?: number): string {
    if (!valor) return '';
    return `$${valor.toLocaleString('es-CO')}`;
  }

  formatearRangoFechas(fechaInicio?: string, fechaFin?: string): string {
    if (!fechaInicio || !fechaFin) return '';
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const opciones = { day: '2-digit', month: 'short' } as const;
    return `${inicio.toLocaleDateString('es-CO', opciones)} - ${fin.toLocaleDateString('es-CO', opciones)}`;
  }

  trackByViaje(index: number): number {
    return index;
  }
}


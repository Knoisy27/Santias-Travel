import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripsService, ViajeIndividual } from '../../../../core/services/trips.service';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Subject, takeUntil } from 'rxjs';
import { TRIPS_SLIDER_CONFIG } from '../../config/trips-slider.config';

@Component({
  selector: 'app-trips-slider',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './trips-slider.component.html',
  styleUrl: './trips-slider.component.scss'
})
export class TripsSliderComponent implements OnInit, OnDestroy {
  viajes = signal<ViajeIndividual[]>([]);
  displayViajes = signal<ViajeIndividual[]>([]);
  currentIndex = signal(0);
  isLoading = signal(true);
  private destroy$ = new Subject<void>();
  readonly config = TRIPS_SLIDER_CONFIG;

  private tripsService: TripsService;
  private router: Router;

  constructor(
    tripsService: TripsService,
    router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.tripsService = tripsService;
    this.router = router;
  }

  ngOnInit(): void {
    this.cargarViajes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarViajes(): void {
    this.isLoading.set(true);
    this.tripsService.getViajesIndividuales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (viajes) => {
          const viajesOrdenados = (viajes || [])
            .sort((a, b) => {
              // Ordenar por fecha de creación descendente (más recientes primero)
              const fechaA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
              const fechaB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
              return fechaB - fechaA;
            })
            .slice(0, this.config.mockData.maxCards); // Tomar solo los últimos N

          // Si no hay suficientes viajes, completar con mocks
          const viajesConMocks = this.completarConMocks(viajesOrdenados);

          this.viajes.set(viajesConMocks);
          this.displayViajes.set([...viajesConMocks, ...viajesConMocks, ...viajesConMocks]); // Triplicar para efecto infinito
          // Iniciar en el segundo grupo (middle) para permitir navegación infinita
          this.currentIndex.set(viajesConMocks.length);
          this.isLoading.set(false);

          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error al cargar viajes:', error);
          // En caso de error, mostrar mocks
          const viajesMocks = this.completarConMocks([]);
          this.viajes.set(viajesMocks);
          this.displayViajes.set([...viajesMocks, ...viajesMocks, ...viajesMocks]);
          // Iniciar en el segundo grupo (middle) para permitir navegación infinita
          this.currentIndex.set(viajesMocks.length);
          this.isLoading.set(false);

          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        }
      });
  }

  private completarConMocks(viajes: ViajeIndividual[]): ViajeIndividual[] {
    const mocksNecesarios = this.config.mockData.maxCards - viajes.length;
    if (mocksNecesarios <= 0) return viajes;

    const mocks: ViajeIndividual[] = [];
    for (let i = 0; i < mocksNecesarios; i++) {
      mocks.push({
        id: undefined,
        nombre: this.config.mockData.nombrePattern(i),
        descripcion: this.config.mockData.defaultDescription,
        valor: 0,
        imagenUrl: this.config.mockData.imagePath,
        fechaInicio: '',
        fechaFin: '',
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

    // Si llegamos antes del inicio del segundo grupo, saltar al final del segundo grupo
    if (nuevoIndex < totalViajes) {
      nuevoIndex = totalViajes * 2 - 1;
    }

    this.currentIndex.set(nuevoIndex);
  }

  moverDerecha(): void {
    if (this.viajes().length === 0) return;

    const totalViajes = this.viajes().length;
    let nuevoIndex = this.currentIndex() + 1;

    // Si llegamos al final del segundo grupo, saltar al inicio del segundo grupo
    if (nuevoIndex >= totalViajes * 2) {
      nuevoIndex = totalViajes;
    }

    this.currentIndex.set(nuevoIndex);
  }

  irADetalle(viaje: ViajeIndividual): void {
    if (viaje?.id) {
      this.router.navigate(['/viajes-a-tu-medida', viaje.id]);
    }
  }

  get transformValue(): string {
    const cardWidth = this.config.tripCard.cardWidth;
    const offset = this.currentIndex() * cardWidth;
    return `translateX(-${offset}px)`;
  }

  truncarTexto(texto: string, maxLength: number = 100): string {
    if (!texto || texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
  }
}


import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, signal, inject, HostListener, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class GroupTripsSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  viajes = signal<ViajeGrupal[]>([]);
  displayViajes = signal<ViajeGrupal[]>([]);
  currentIndex = signal(0);
  isLoading = signal(true);
  cardWidth = signal(GROUP_TRIPS_SLIDER_CONFIG.slider.cardWidth);
  dragOffset = signal(0);
  
  readonly config = GROUP_TRIPS_SLIDER_CONFIG;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  // Variables para el control del deslizamiento
  private startX = 0;
  private isDragging = false;
  private minSwipeDistance = 50;

  private tripsService = inject(TripsService);
  private router = inject(Router);

  constructor(
    private cdr: ChangeDetectorRef, 
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.calcularAnchoTarjeta();
    this.cargarViajes();
  }

  ngAfterViewInit(): void {
    this.calcularAnchoTarjeta();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.calcularAnchoTarjeta();
  }

  // Manejo de eventos de ratón y táctiles
  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.startX = this.getPositionX(event);
    this.dragOffset.set(0);
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    const currentX = this.getPositionX(event);
    const diff = currentX - this.startX;
    this.dragOffset.set(diff);
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onDragEnd(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    const moved = this.dragOffset();
    
    if (Math.abs(moved) > this.minSwipeDistance) {
      if (moved < 0) {
        this.moverDerecha();
      } else {
        this.moverIzquierda();
      }
    }
    
    this.dragOffset.set(0);
  }

  private getPositionX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  private calcularAnchoTarjeta(): void {
    if (this.isBrowser) {
      const anchoPantalla = document.documentElement.clientWidth || window.innerWidth;
      const breakpointMovil = 768;
      
      if (anchoPantalla <= breakpointMovil) {
        // En móvil: Ancho pantalla - padding del contenedor (16px * 2 = 32px)
        const paddingTotal = 32;
        const anchoDisponible = anchoPantalla - paddingTotal;
        this.cardWidth.set(Math.max(anchoDisponible, 280));
      } else {
        this.cardWidth.set(this.config.slider.cardWidth);
      }
      
      this.cdr.markForCheck();
    }
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
            setTimeout(() => this.calcularAnchoTarjeta(), 0);
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
            setTimeout(() => this.calcularAnchoTarjeta(), 0);
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
    // Evitar navegación si se estaba arrastrando
    if (this.isDragging || Math.abs(this.dragOffset()) > 5) return;
    
    if (viaje?.idVigr) {
      this.router.navigate(['/viajes-grupales', viaje.idVigr]).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  get transformValue(): string {
    const cardWidth = this.cardWidth();
    // Ajustar gap a 16px para consistencia o usar el config.slider.cardGap si se prefiere
    // En CSS de group-trips-slider está en 1.2rem (aprox 19.2px) pero mejor estandarizar
    // Voy a usar el mismo cálculo que en trips-slider para consistencia en móvil: 16px (1rem)
    // Pero debo revisar el CSS de group-trips-slider
    const gap = 16; 
    const offset = this.currentIndex() * (cardWidth + gap);
    return `translateX(calc(-${offset}px + ${this.dragOffset()}px))`;
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

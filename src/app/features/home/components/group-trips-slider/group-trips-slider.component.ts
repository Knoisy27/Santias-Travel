import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, signal, inject, HostListener, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLElement>;
  
  viajes = signal<ViajeGrupal[]>([]);
  displayViajes = signal<ViajeGrupal[]>([]);
  currentIndex = signal(0);
  isLoading = signal(true);
  cardWidth = signal(GROUP_TRIPS_SLIDER_CONFIG.slider.cardWidth);
  visibleCards = signal(1);
  viewportWidth = signal(0);
  dragOffset = signal(0);
  
  readonly config = GROUP_TRIPS_SLIDER_CONFIG;
  readonly FIXED_CARD_WIDTH = 340; // Ancho fijo de cada tarjeta
  readonly CARD_GAP = 16; // Gap entre tarjetas
  
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
      const screenWidth = document.documentElement.clientWidth || window.innerWidth;
      const breakpointMovil = 480;
      
      // Usar el ancho real del contenedor si está disponible
      let containerWidth = screenWidth;
      if (this.sliderContainer?.nativeElement) {
        containerWidth = this.sliderContainer.nativeElement.offsetWidth;
      }
      
      if (screenWidth <= breakpointMovil) {
        // En móvil pequeño: La tarjeta ocupa el 100% del ancho de pantalla
        this.cardWidth.set(screenWidth);
        this.visibleCards.set(1);
        this.viewportWidth.set(screenWidth);
      } else {
        // Tarjetas con ancho fijo
        this.cardWidth.set(this.FIXED_CARD_WIDTH);
        
        // Calcular cuántas tarjetas caben en el contenedor disponible
        const buttonSpace = 120; // 60px padding a cada lado para los botones
        const availableWidth = containerWidth - buttonSpace;
        const cardWithGap = this.FIXED_CARD_WIDTH + this.CARD_GAP;
        const numCards = Math.max(1, Math.floor((availableWidth + this.CARD_GAP) / cardWithGap));
        this.visibleCards.set(numCards);
        
        // Ancho exacto para mostrar N tarjetas completas
        const exactWidth = (numCards * this.FIXED_CARD_WIDTH) + ((numCards - 1) * this.CARD_GAP);
        this.viewportWidth.set(exactWidth);
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
            .slice(0, this.config.slider.maxRealTrips);

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

  get currentGap(): number {
    const isMobile = this.isBrowser && window.innerWidth <= 480;
    return isMobile ? 0 : this.CARD_GAP;
  }

  get transformValue(): string {
    const cardWidth = this.cardWidth();
    const gap = this.currentGap;
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

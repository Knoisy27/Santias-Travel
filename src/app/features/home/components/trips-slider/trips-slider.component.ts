import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, signal, HostListener, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class TripsSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLElement>;
  
  viajes = signal<ViajeIndividual[]>([]);
  displayViajes = signal<ViajeIndividual[]>([]);
  currentIndex = signal(0);
  isLoading = signal(true);
  cardWidth = signal(TRIPS_SLIDER_CONFIG.tripCard.cardWidth);
  visibleCards = signal(1);
  viewportWidth = signal(0);
  dragOffset = signal(0);
  
  private destroy$ = new Subject<void>();
  readonly config = TRIPS_SLIDER_CONFIG;
  readonly FIXED_CARD_WIDTH = 340;
  readonly CARD_GAP = 16;
  private isBrowser: boolean;

  // Variables para el control del deslizamiento
  private startX = 0;
  private isDragging = false;
  private minSwipeDistance = 50;

  constructor(
    private tripsService: TripsService,
    private router: Router,
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
    this.tripsService.getViajesIndividuales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (viajes) => {
          const viajesOrdenados = (viajes || [])
            .sort((a, b) => {
              const fechaA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
              const fechaB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
              return fechaB - fechaA;
            })
            .slice(0, this.config.mockData.maxRealTrips);

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
          console.error('Error al cargar viajes:', error);
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
        imagenListadoUrl: this.config.mockData.imagePath,
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

  irADetalle(viaje: ViajeIndividual): void {
    // Evitar navegación si se estaba arrastrando
    if (this.isDragging || Math.abs(this.dragOffset()) > 5) return;
    
    if (viaje?.id) {
      this.router.navigate(['/viajes-a-tu-medida', viaje.id]).then(() => {
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
    const baseOffset = this.currentIndex() * (cardWidth + gap);
    return `translateX(calc(-${baseOffset}px + ${this.dragOffset()}px))`;
  }

  truncarTexto(texto: string, maxLength: number = 100): string {
    if (!texto || texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
  }

  getCardImage(viaje: ViajeIndividual): string {
    return viaje.imagenListadoUrl || viaje.imagenUrl || this.config.tripCard.placeholderImage;
  }

  getCardDescripcion(viaje: ViajeIndividual): string {
    return viaje.descripcionCorta?.trim() || viaje.descripcion || '';
  }

  trackByViaje(index: number, viaje: ViajeIndividual): number {
    return viaje?.id ?? index;
  }

  formatPrice(valor?: number): string {
    if (!valor) return '';
    return `$${valor.toLocaleString('es-CO')}`;
  }
}

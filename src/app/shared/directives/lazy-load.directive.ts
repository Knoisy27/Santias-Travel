import { Directive, ElementRef, Input, OnInit, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../core/services/utils.service';
import { ImageOptimizationService } from '../../core/services/image-optimization.service';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() appLazyLoad: string = '';
  @Input() placeholder: string = '/assets/images/placeholder.jpg';
  @Input() errorImage: string = '/assets/images/error.jpg';
  @Input() threshold: number = 0.1;
  @Input() width?: number;
  @Input() height?: number;
  @Input() quality: number = 80;
  @Input() enableOptimization: boolean = true;

  @Output() imageLoaded = new EventEmitter<string>();
  @Output() imageError = new EventEmitter<string>();

  private element = inject(ElementRef);
  private utilsService = inject(UtilsService);
  private imageService = inject(ImageOptimizationService);
  private observer?: IntersectionObserver;
  private isLoaded = false;

  ngOnInit(): void {
    if (!this.appLazyLoad) return;

    this.setupLazyLoading();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupLazyLoading(): void {
    // Verificar si IntersectionObserver está disponible
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores que no soportan IntersectionObserver
      this.loadImage();
      return;
    }

    // Configurar el observer
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoaded) {
          this.loadImage();
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    // Iniciar observación
    this.observer.observe(this.element.nativeElement);
  }

  private loadImage(): void {
    if (this.isLoaded) return;

    const img = this.element.nativeElement as HTMLImageElement;
    
    // Mostrar placeholder mientras carga
    if (this.placeholder) {
      img.src = this.placeholder;
      img.classList.add('loading');
    }

    // Generar URL optimizada si está habilitado
    const imageUrl = this.enableOptimization 
      ? this.imageService.generateOptimizedImageUrl(this.appLazyLoad, this.width, this.height, this.quality)
      : this.appLazyLoad;

    // Crear nueva imagen para precargar
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Imagen cargada exitosamente
      img.src = imageUrl;
      img.classList.remove('loading');
      img.classList.add('loaded');
      this.isLoaded = true;
      this.imageLoaded.emit(imageUrl);
    };

    imageLoader.onerror = () => {
      // Error al cargar la imagen
      if (this.errorImage) {
        img.src = this.errorImage;
      }
      img.classList.remove('loading');
      img.classList.add('error');
      this.isLoaded = true;
      this.imageError.emit(this.appLazyLoad);
    };

    // Iniciar carga
    imageLoader.src = imageUrl;
  }

  /**
   * Fuerza la carga de la imagen
   */
  forceLoad(): void {
    if (!this.isLoaded) {
      this.loadImage();
    }
  }

  /**
   * Resetea la directiva para recargar la imagen
   */
  reset(): void {
    this.isLoaded = false;
    const img = this.element.nativeElement as HTMLImageElement;
    img.classList.remove('loaded', 'error', 'loading');
    img.src = this.placeholder || '';
    
    if (this.observer) {
      this.observer.observe(this.element.nativeElement);
    }
  }
}

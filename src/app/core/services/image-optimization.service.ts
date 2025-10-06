import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private utilsService = new UtilsService();

  /**
   * Genera URLs optimizadas para imágenes con diferentes tamaños
   */
  generateOptimizedImageUrl(
    baseUrl: string, 
    width?: number, 
    height?: number, 
    quality: number = 80
  ): string {
    // Si es una URL externa, devolverla tal como está
    if (baseUrl.startsWith('http')) {
      return baseUrl;
    }

    // Para imágenes locales, agregar parámetros de optimización
    const params = new URLSearchParams();
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 80) params.set('q', quality.toString());
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  /**
   * Genera srcset para imágenes responsivas
   */
  generateSrcSet(baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280]): string {
    return sizes
      .map(size => `${this.generateOptimizedImageUrl(baseUrl, size)} ${size}w`)
      .join(', ');
  }

  /**
   * Obtiene el tamaño de imagen recomendado según el breakpoint
   */
  getRecommendedImageSize(breakpoint: 'mobile' | 'tablet' | 'desktop'): { width: number; height: number } {
    const sizes = {
      mobile: { width: 375, height: 250 },
      tablet: { width: 768, height: 400 },
      desktop: { width: 1200, height: 600 }
    };
    
    return sizes[breakpoint];
  }

  /**
   * Genera placeholder para lazy loading
   */
  generatePlaceholder(width: number, height: number, text: string = 'Cargando...'): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = width;
    canvas.height = height;
    
    // Fondo gris claro
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    // Texto centrado
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    return canvas.toDataURL();
  }

  /**
   * Valida si una imagen es válida
   */
  async validateImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * Preloada una imagen
   */
  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  /**
   * Genera URL para imagen de error
   */
  getErrorImageUrl(): string {
    return '/assets/images/error-placeholder.jpg';
  }

  /**
   * Genera URL para imagen de placeholder
   */
  getPlaceholderImageUrl(): string {
    return '/assets/images/placeholder.jpg';
  }

  /**
   * Optimiza imágenes para diferentes dispositivos
   */
  getResponsiveImageConfig(baseUrl: string) {
    const deviceType = this.utilsService.getDeviceType();
    const { width, height } = this.getRecommendedImageSize(deviceType);
    
    return {
      src: this.generateOptimizedImageUrl(baseUrl, width, height),
      srcset: this.generateSrcSet(baseUrl),
      sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
      loading: 'lazy' as const,
      alt: 'Imagen optimizada'
    };
  }
}

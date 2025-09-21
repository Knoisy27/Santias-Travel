import { Injectable } from '@angular/core';

export interface WebVitalsMetrics {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

@Injectable({
  providedIn: 'root'
})
export class WebVitalsService {
  private metrics: WebVitalsMetrics = {};

  constructor() {
    this.initializeWebVitals();
  }

  /**
   * Inicializa el monitoreo de Core Web Vitals
   */
  private initializeWebVitals(): void {
    // Solo ejecutar en el navegador
    if (typeof window === 'undefined') return;

    // LCP - Largest Contentful Paint
    this.measureLCP();
    
    // FID - First Input Delay
    this.measureFID();
    
    // CLS - Cumulative Layout Shift
    this.measureCLS();
    
    // FCP - First Contentful Paint
    this.measureFCP();
  }

  /**
   * Mide el Largest Contentful Paint (LCP)
   */
  private measureLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.startTime;
        this.logMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  /**
   * Mide el First Input Delay (FID)
   */
  private measureFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.logMetric('FID', this.metrics.FID);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  /**
   * Mide el Cumulative Layout Shift (CLS)
   */
  private measureCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.CLS = clsValue;
        this.logMetric('CLS', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Mide el First Contentful Paint (FCP)
   */
  private measureFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.FCP = entry.startTime;
          this.logMetric('FCP', entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Registra una métrica
   */
  private logMetric(name: string, value: number): void {
    console.log(`Web Vitals - ${name}:`, value);
    
    // Enviar a analytics si está disponible
    this.sendToAnalytics(name, value);
  }

  /**
   * Envía métricas a analytics
   */
  private sendToAnalytics(name: string, value: number): void {
    // Aquí podrías integrar con Google Analytics, Mixpanel, etc.
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        non_interaction: true
      });
    }
  }

  /**
   * Obtiene todas las métricas
   */
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  /**
   * Obtiene una métrica específica
   */
  getMetric(name: keyof WebVitalsMetrics): number | undefined {
    return this.metrics[name];
  }

  /**
   * Verifica si las métricas están dentro de los rangos recomendados
   */
  getMetricsStatus(): { [key: string]: 'good' | 'needs-improvement' | 'poor' } {
    const status: { [key: string]: 'good' | 'needs-improvement' | 'poor' } = {};

    // LCP thresholds: good < 2.5s, needs-improvement < 4s, poor >= 4s
    if (this.metrics['LCP'] !== undefined) {
      if (this.metrics['LCP'] < 2500) status['LCP'] = 'good';
      else if (this.metrics['LCP'] < 4000) status['LCP'] = 'needs-improvement';
      else status['LCP'] = 'poor';
    }

    // FID thresholds: good < 100ms, needs-improvement < 300ms, poor >= 300ms
    if (this.metrics['FID'] !== undefined) {
      if (this.metrics['FID'] < 100) status['FID'] = 'good';
      else if (this.metrics['FID'] < 300) status['FID'] = 'needs-improvement';
      else status['FID'] = 'poor';
    }

    // CLS thresholds: good < 0.1, needs-improvement < 0.25, poor >= 0.25
    if (this.metrics['CLS'] !== undefined) {
      if (this.metrics['CLS'] < 0.1) status['CLS'] = 'good';
      else if (this.metrics['CLS'] < 0.25) status['CLS'] = 'needs-improvement';
      else status['CLS'] = 'poor';
    }

    // FCP thresholds: good < 1.8s, needs-improvement < 3s, poor >= 3s
    if (this.metrics['FCP'] !== undefined) {
      if (this.metrics['FCP'] < 1800) status['FCP'] = 'good';
      else if (this.metrics['FCP'] < 3000) status['FCP'] = 'needs-improvement';
      else status['FCP'] = 'poor';
    }

    return status;
  }

  /**
   * Obtiene recomendaciones de optimización
   */
  getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const status = this.getMetricsStatus();

    if (status['LCP'] === 'poor' || status['LCP'] === 'needs-improvement') {
      recommendations.push('Optimiza el LCP: Reduce el tamaño de imágenes, usa lazy loading, optimiza CSS crítico');
    }

    if (status['FID'] === 'poor' || status['FID'] === 'needs-improvement') {
      recommendations.push('Optimiza el FID: Reduce JavaScript bloqueante, usa code splitting, optimiza terceros');
    }

    if (status['CLS'] === 'poor' || status['CLS'] === 'needs-improvement') {
      recommendations.push('Optimiza el CLS: Reserva espacio para imágenes, evita contenido que se mueve, usa fuentes web optimizadas');
    }

    if (status['FCP'] === 'poor' || status['FCP'] === 'needs-improvement') {
      recommendations.push('Optimiza el FCP: Reduce el tiempo de carga inicial, optimiza recursos críticos, usa preload');
    }

    return recommendations;
  }

  /**
   * Mide el rendimiento de una función específica
   */
  measurePerformance<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`Performance - ${name}:`, `${(end - start).toFixed(2)}ms`);
    return result;
  }

  /**
   * Mide el rendimiento de una función asíncrona
   */
  async measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    console.log(`Performance - ${name}:`, `${(end - start).toFixed(2)}ms`);
    return result;
  }
}

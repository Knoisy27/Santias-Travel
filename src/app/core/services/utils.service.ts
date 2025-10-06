import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  /**
   * Formatea un número como moneda colombiana
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Formatea un número con separadores de miles
   */
  formatNumber(number: number): string {
    return new Intl.NumberFormat('es-CO').format(number);
  }

  /**
   * Formatea una fecha en formato local
   */
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('es-CO', { ...defaultOptions, ...options }).format(dateObj);
  }

  /**
   * Genera un ID único
   */
  generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Debounce para funciones
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle para funciones
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Copia texto al portapapeles
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  /**
   * Valida si un email es válido
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida si un teléfono colombiano es válido
   */
  isValidColombianPhone(phone: string): boolean {
    const phoneRegex = /^(\+57|57)?[1-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Sanitiza texto para prevenir XSS
   */
  sanitizeText(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Genera una URL de WhatsApp con mensaje
   */
  generateWhatsAppUrl(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Abre WhatsApp en una nueva ventana
   */
  openWhatsApp(phone: string, message: string): void {
    const url = this.generateWhatsAppUrl(phone, message);
    window.open(url, '_blank');
  }

  /**
   * Obtiene el mensaje de WhatsApp por defecto según el contexto
   */
  getWhatsAppMessage(context: 'default' | 'contact' | 'newsletter' | 'destination' = 'default'): string {
    return APP_CONSTANTS.WHATSAPP_MESSAGES[context] || APP_CONSTANTS.WHATSAPP_MESSAGES.default;
  }

  /**
   * Scroll suave a un elemento
   */
  scrollToElement(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Scroll al top de la página
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Verifica si el dispositivo es móvil
   */
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  /**
   * Verifica si el dispositivo es tablet
   */
  isTablet(): boolean {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  /**
   * Verifica si el dispositivo es desktop
   */
  isDesktop(): boolean {
    return window.innerWidth > 1024;
  }

  /**
   * Obtiene el tipo de dispositivo actual
   */
  getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  /**
   * Genera un slug a partir de un texto
   */
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim();
  }

  /**
   * Trunca texto a una longitud específica
   */
  truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Capitaliza la primera letra de cada palabra
   */
  capitalizeWords(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Convierte bytes a formato legible
   */
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Obtiene parámetros de URL
   */
  getUrlParams(): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    const urlParams = new URLSearchParams(window.location.search);
    
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    
    return params;
  }

  /**
   * Establece parámetros de URL sin recargar la página
   */
  setUrlParams(params: { [key: string]: string }): void {
    const url = new URL(window.location.href);
    
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });
    
    window.history.replaceState({}, '', url.toString());
  }
}

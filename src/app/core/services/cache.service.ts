import { Injectable } from '@angular/core';

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Almacena un elemento en caché
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
    
    this.cache.set(key, item);
  }

  /**
   * Obtiene un elemento de caché
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Verifica si un elemento existe en caché y no ha expirado
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Verificar si ha expirado
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Elimina un elemento de caché
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpia todos los elementos expirados
   */
  cleanExpired(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Limpia toda la caché
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtiene el tamaño de la caché
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Obtiene todas las claves de la caché
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Obtiene información sobre un elemento de caché
   */
  getInfo(key: string): { timestamp: number; expiresAt: number; isExpired: boolean } | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    return {
      timestamp: item.timestamp,
      expiresAt: item.expiresAt,
      isExpired: Date.now() > item.expiresAt
    };
  }

  /**
   * Almacena datos de API con caché inteligente
   */
  setApiData<T>(endpoint: string, data: T, ttl?: number): void {
    const key = `api:${endpoint}`;
    this.set(key, data, ttl);
  }

  /**
   * Obtiene datos de API de caché
   */
  getApiData<T>(endpoint: string): T | null {
    const key = `api:${endpoint}`;
    return this.get<T>(key);
  }

  /**
   * Almacena datos de usuario con caché de sesión
   */
  setUserData<T>(key: string, data: T): void {
    const sessionKey = `user:${key}`;
    // Caché de sesión dura hasta que se cierre el navegador
    this.set(sessionKey, data, 24 * 60 * 60 * 1000); // 24 horas
  }

  /**
   * Obtiene datos de usuario de caché
   */
  getUserData<T>(key: string): T | null {
    const sessionKey = `user:${key}`;
    return this.get<T>(sessionKey);
  }

  /**
   * Almacena datos de configuración con caché persistente
   */
  setConfigData<T>(key: string, data: T): void {
    const configKey = `config:${key}`;
    // Caché de configuración dura 7 días
    this.set(configKey, data, 7 * 24 * 60 * 60 * 1000);
  }

  /**
   * Obtiene datos de configuración de caché
   */
  getConfigData<T>(key: string): T | null {
    const configKey = `config:${key}`;
    return this.get<T>(configKey);
  }

  /**
   * Almacena datos de imágenes con caché optimizada
   */
  setImageData<T>(imageUrl: string, data: T): void {
    const key = `image:${imageUrl}`;
    // Las imágenes se cachean por 30 días
    this.set(key, data, 30 * 24 * 60 * 60 * 1000);
  }

  /**
   * Obtiene datos de imágenes de caché
   */
  getImageData<T>(imageUrl: string): T | null {
    const key = `image:${imageUrl}`;
    return this.get<T>(key);
  }

  /**
   * Inicializa la limpieza automática de caché
   */
  initializeAutoCleanup(): void {
    // Limpiar caché expirada cada 5 minutos
    setInterval(() => {
      this.cleanExpired();
    }, 5 * 60 * 1000);
  }

  /**
   * Obtiene estadísticas de la caché
   */
  getStats(): {
    size: number;
    expired: number;
    active: number;
    memoryUsage: number;
  } {
    const now = Date.now();
    let expired = 0;
    let active = 0;
    let memoryUsage = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        expired++;
      } else {
        active++;
        memoryUsage += JSON.stringify(item).length;
      }
    }

    return {
      size: this.cache.size,
      expired,
      active,
      memoryUsage
    };
  }
}

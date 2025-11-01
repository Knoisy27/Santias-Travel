import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map, timeout } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { SessionEventsService } from './session-events.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  nombre: string;
  apellido: string;
  rol: string;
  message: string;
  timestamp: string;
}

export interface User {
  username: string;
  name: string;
  role: 'admin' | 'agent';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'santias_travel_token';
  private readonly userKey = 'santias_travel_user';
  
  // Signals para el estado de autenticación
  private _isAuthenticated = signal(false);
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  
  // Observables públicos
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);
  public user$ = new BehaviorSubject<User | null>(null);
  
  // Computed signals
  public isAuthenticated = computed(() => this._isAuthenticated());
  public user = computed(() => this._user());
  public token = computed(() => this._token());
  
  private sessionEvents = inject(SessionEventsService);
  private injector = inject(Injector);
  
  constructor(private apiService: ApiService) {
    this.initializeAuth();
  }
  
  private initializeAuth(): void {
    // Verificar que estamos en el navegador (no en SSR)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this._token.set(token);
        this._user.set(user);
        this._isAuthenticated.set(true);
        this.isAuthenticated$.next(true);
        this.user$.next(user);
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        this.clearAuth();
      }
    }
  }
  
  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    
    // Hacer petición directa sin envolver en ApiResponse
    return this.apiService['http'].post<LoginResponse>(`${this.apiService['baseUrl']}/auth/login`, credentials, {
      withCredentials: true // CRÍTICO para cookies
    })
      .pipe(
        tap(data => {
          // Mapear la respuesta del backend al formato esperado
          const user = {
            username: data.username,
            name: `${data.nombre} ${data.apellido}`.trim(),
            role: data.rol.toLowerCase() as 'admin' | 'agent'
          };
          // Usar accessToken directamente (ya incluye "Bearer ")
          this.setAuthData(data.accessToken, user);
          
          // Emitir evento de login exitoso
          this.sessionEvents.emitLoginSuccess();
          
          // Activar timer después del login con un pequeño delay para permitir redirección
          setTimeout(() => {
            this.activateTimerAfterLogin();
          }, 500);
        }),
        catchError(error => {
          console.error(' Error en login:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url,
            error: error.error
          });
          throw error;
        })
      );
  }
  
  /**
   * Cerrar sesión completo (con notificación al backend)
   */
  logout(reason?: string): void {
    // Obtener token antes de limpiar datos
    const token = this._token();
    
    // Emitir evento de logout
    this.sessionEvents.emitLogout(reason || 'Logout manual');
    
    // Limpiar datos locales inmediatamente
    this.clearAuth();
    
    // Notificar al backend para invalidar el token (sin bloquear)
    this.notifyLogoutToBackend(token);
    
    if (reason && environment.session.logActivity) {
      console.log('AuthService: Logout ejecutado. Motivo:', reason);
    }
  }
  
  /**
   * Cerrar sesión solo local (sin notificar al backend)
   * Útil para evitar problemas de carga
   */
  logoutLocal(): void {
    // Solo limpiar datos locales
    this.clearAuth();
  }
  
  /**
   * Notificar al backend sobre el logout para invalidar el token
   */
  private notifyLogoutToBackend(token: string | null): void {
    if (token) {
      // Hacer petición al backend para invalidar el token con timeout
      this.apiService['http'].post(`${this.apiService['baseUrl']}/auth/logout`, {}, {
        headers: {
          'Authorization': token
        },
        withCredentials: true // CRÍTICO para cookies
      }).pipe(
        // Timeout de 5 segundos para evitar que se cuelgue
        timeout(5000)
      ).subscribe({
        next: () => {
          console.log('✅ Token invalidado en el backend');
        },
        error: (error) => {
          if (error.name === 'TimeoutError') {
            console.warn(' Timeout al notificar logout al backend');
          } else {
            console.warn(' No se pudo notificar logout al backend:', error);
          }
          // El logout local ya se completó, esto es solo informativo
        }
      });
    }
  }
  
  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: 'admin' | 'agent'): boolean {
    const user = this._user();
    return user?.role === role;
  }
  
  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }
  
  /**
   * Verificar si el usuario es agente
   */
  isAgent(): boolean {
    return this.hasRole('agent');
  }
  
  /**
   * Obtener el token de autenticación
   */
  getToken(): string | null {
    return this._token();
  }
  
  /**
   * Verificar si el token está expirado
   */
  isTokenExpired(): boolean {
    const token = this._token();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
  
  /**
   * Establecer datos de autenticación
   */
  private setAuthData(token: string, user: User): void {
    // Verificar que estamos en el navegador
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    
    this._token.set(token);
    this._user.set(user);
    this._isAuthenticated.set(true);
    
    this.isAuthenticated$.next(true);
    this.user$.next(user);
  }
  
  /**
   * Limpiar datos de autenticación
   */
  private clearAuth(): void {
    // Verificar que estamos en el navegador
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    
    this._token.set(null);
    this._user.set(null);
    this._isAuthenticated.set(false);
    
    this.isAuthenticated$.next(false);
    this.user$.next(null);
  }
  
  /**
   * Validar sesión con el backend
   */
  validateSession(): Observable<any> {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] AuthService: 🔍 Validando sesión con backend`);
    
    // Con cookies, no necesitamos enviar el token en el header
    return this.apiService['http'].post(`${this.apiService['baseUrl']}/auth/session/validate`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        const successTime = new Date().toLocaleTimeString();
        console.log(`[${successTime}] AuthService: ✅ Sesión válida`);
      }),
      catchError(error => {
        const errorTime = new Date().toLocaleTimeString();
        console.error(`[${errorTime}] AuthService: ❌ Error al validar sesión:`, error);
        throw error;
      })
    );
  }
  
  /**
   * Extender sesión por 1 hora más
   */
  extendSession(): Observable<any> {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] AuthService: 🔄 Extendiendo sesión por 1 hora más`);
    
    // Con cookies, no necesitamos enviar el token en el header
    return this.apiService['http'].post(`${this.apiService['baseUrl']}/auth/session/extend`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        const successTime = new Date().toLocaleTimeString();
        console.log(`[${successTime}] AuthService: ✅ Sesión extendida exitosamente`);
      }),
      catchError(error => {
        const errorTime = new Date().toLocaleTimeString();
        console.error(`[${errorTime}] AuthService: ❌ Error al extender sesión:`, error);
        throw error;
      })
    );
  }

  /**
   * Activar timer después del login
   */
  private activateTimerAfterLogin(): void {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] AuthService: 🚀 Activando timer después del login`);
    
    // Importar dinámicamente SessionManagerService para evitar dependencias circulares
    import('./session-manager.service').then(module => {
      const sessionManager = this.injector.get(module.SessionManagerService);
      sessionManager.activateTimerAfterLogin();
    });
  }
}

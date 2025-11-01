import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { SessionEventsService } from './session-events.service';
import { SESSION_CONFIG } from '../config/session.config';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private sessionEvents = inject(SessionEventsService);
  
  private sessionTimer?: number;
  private warningTimer?: number;
  private inactivityTimer?: number;
  private lastActivity = Date.now();
  private isSessionActive = false;
  
  // Configuración desde archivo central
  private readonly SESSION_DURATION = SESSION_CONFIG.SESSION_DURATION;
  private readonly INACTIVITY_LIMIT = SESSION_CONFIG.INACTIVITY_LIMIT;
  private readonly WARNING_TIME = SESSION_CONFIG.WARNING_TIME;
  private readonly ACTIVITY_EVENTS = SESSION_CONFIG.ACTIVITY_EVENTS;
  private readonly AUTO_EXTEND_ON_ACTIVITY = SESSION_CONFIG.AUTO_EXTEND_ON_ACTIVITY;
  
  constructor() {
    // Inicialización automática si hay sesión activa
    // Usar setTimeout para asegurar que AuthService esté listo
    setTimeout(() => {
      this.checkAndInitializeSession();
    }, 100);
    
    // Suscribirse a eventos de login/logout
    this.sessionEvents.loginSuccess$.subscribe(() => {
      console.log('SessionManager: Evento de login recibido');
      this.restartSessionManagement();
    });
    
    this.sessionEvents.logoutSuccess$.subscribe((reason) => {
      console.log('SessionManager: Evento de logout recibido:', reason);
      this.stopSessionManagement();
    });
  }
  
  /**
   * Verificar si hay sesión activa e inicializar
   */
  private checkAndInitializeSession(): void {
    try {
      // No inicializar en la página de login
      if (this.router.url.includes('/login')) {
        console.log('SessionManager: En página de login, no inicializar gestión de sesión');
        return;
      }
      
      if (this.authService.isAuthenticated()) {
        console.log('SessionManager: Sesión detectada, iniciando gestión');
        this.initializeSessionManagement();
      } else {
        console.log('SessionManager: No hay sesión activa');
      }
    } catch (error) {
      console.log('SessionManager: Error al verificar sesión:', error);
    }
  }
  
  /**
   * Inicializar gestión de sesión
   */
  private initializeSessionManagement(): void {
    if (this.isSessionActive) {
      console.log('SessionManager: ⚠️ Gestión de sesión ya está activa, ignorando inicialización');
      return; // Ya está activo
    }
    
    const now = new Date();
    const nowTime = now.toLocaleTimeString();
    const sessionEndTime = new Date(Date.now() + this.SESSION_DURATION);
    
    this.isSessionActive = true;
    this.lastActivity = Date.now();
    
    if (environment.session.logActivity) {
      console.log(`[${nowTime}] SessionManager: 🚀 Iniciando gestión de sesión`);
      console.log(`[${nowTime}] SessionManager: ⏱️ Duración de sesión: ${this.SESSION_DURATION}ms (${this.SESSION_DURATION/1000/60/60} horas)`);
      console.log(`[${nowTime}] SessionManager: ⏰ Sesión expirará a las ${sessionEndTime.toLocaleTimeString()}`);
      console.log(`[${nowTime}] SessionManager: ⏱️ Límite de inactividad: ${this.INACTIVITY_LIMIT}ms (${this.INACTIVITY_LIMIT/1000} segundos)`);
    }
    
    // Timer principal de 7 horas
    this.sessionTimer = window.setTimeout(() => {
      const timeoutTime = new Date().toLocaleTimeString();
      console.log(`[${timeoutTime}] SessionManager: ⏰ TIMEOUT DE SESIÓN PRINCIPAL - Forzando logout`);
      this.forceLogout(SESSION_CONFIG.MESSAGES.SESSION_EXPIRED);
    }, this.SESSION_DURATION);
    
    // Detectar actividad del usuario
    this.setupActivityDetection();
    
    // Validar sesión al cargar
    this.validateSessionOnLoad();
  }
  
  /**
   * Configurar detección de actividad del usuario
   */
  private setupActivityDetection(): void {
    // Usar throttling para evitar demasiadas llamadas
    let lastActivityTime = 0;
    const THROTTLE_TIME = 2000; // 2 segundos entre detecciones
    
    const throttledUpdateActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > THROTTLE_TIME) {
        lastActivityTime = now;
        this.updateActivity();
      }
    };
    
    this.ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, throttledUpdateActivity, { passive: true });
    });
  }
  
  /**
   * Actualizar actividad del usuario
   */
  private updateActivity(): void {
    // No procesar actividad si no hay sesión activa o si estamos en login
    if (!this.isSessionActive || this.router.url.includes('/login')) {
      return;
    }
    
    const now = new Date();
    const nowTime = now.toLocaleTimeString();
    this.lastActivity = Date.now();
    
    if (environment.session.logActivity) {
      console.log(`[${nowTime}] SessionManager: 🖱️ Actividad detectada`);
    }
    
    // Limpiar timer de inactividad anterior
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      if (environment.session.logActivity) {
        console.log(`[${nowTime}] SessionManager: ⏹️ Timer de inactividad anterior cancelado`);
      }
    }
    
    if (environment.session.logActivity) {
      console.log(`[${nowTime}] SessionManager: 🔄 Timer de inactividad reiniciado`);
    }
    
    // Calcular tiempo de expiración
    const expirationTime = new Date(Date.now() + this.INACTIVITY_LIMIT);
    
    // Nuevo timer de inactividad
    this.inactivityTimer = window.setTimeout(() => {
      const timeoutTime = new Date().toLocaleTimeString();
      console.log(`[${timeoutTime}] SessionManager: ⏰ TIMEOUT DE INACTIVIDAD ALCANZADO - Mostrando advertencia`);
      this.showInactivityWarning();
    }, this.INACTIVITY_LIMIT);
    
    if (environment.session.logActivity) {
      console.log(`[${nowTime}] SessionManager: ⏱️ Timer de inactividad configurado para ${this.INACTIVITY_LIMIT}ms (${this.INACTIVITY_LIMIT/1000} segundos)`);
      console.log(`[${nowTime}] SessionManager: ⏰ Timer expirará a las ${expirationTime.toLocaleTimeString()}`);
    }
    
    // Auto-extender si está configurado
    if (this.AUTO_EXTEND_ON_ACTIVITY) {
      this.extendSession();
    }
  }
  
  /**
   * Mostrar advertencia de inactividad
   */
  private showInactivityWarning(): void {
    const now = new Date();
    const nowTime = now.toLocaleTimeString();
    const warningEndTime = new Date(Date.now() + this.WARNING_TIME);
    
    console.log(`[${nowTime}] SessionManager: ⚠️ Mostrando advertencia de inactividad`);
    console.log(`[${nowTime}] SessionManager: ⏱️ Tiempo de advertencia: ${this.WARNING_TIME}ms (${this.WARNING_TIME/1000} segundos)`);
    console.log(`[${nowTime}] SessionManager: ⏰ Advertencia expirará a las ${warningEndTime.toLocaleTimeString()}`);
    
    // Importar dinámicamente el componente para evitar dependencias circulares
    import('../../shared/components/session-warning-dialog/session-warning-dialog.component').then(module => {
      const dialogRef = this.dialog.open(module.SessionWarningDialogComponent, {
        width: '400px',
        disableClose: true,
        data: {
          message: SESSION_CONFIG.MESSAGES.INACTIVITY_WARNING,
          timeLeft: this.WARNING_TIME / 1000, // Convertir a segundos
          canExtend: true
        }
      });
      
      console.log(`[${nowTime}] SessionManager: 📱 Diálogo de advertencia abierto`);
      
      // Timer de 5 minutos
      this.warningTimer = window.setTimeout(() => {
        const timeoutTime = new Date().toLocaleTimeString();
        console.log(`[${timeoutTime}] SessionManager: ⏰ TIMEOUT DE ADVERTENCIA - Cerrando diálogo y forzando logout`);
        dialogRef.close();
        this.forceLogout(SESSION_CONFIG.MESSAGES.SESSION_INACTIVE);
      }, this.WARNING_TIME);
      
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'extend') {
          this.extendSession();
        } else if (result === 'logout') {
          this.forceLogout('Sesión cerrada por el usuario');
        }
      });
    });
  }
  
  /**
   * Extender sesión por 1 hora más
   */
  private extendSession(): void {
    const now = new Date();
    const nowTime = now.toLocaleTimeString();
    
    console.log(`[${nowTime}] SessionManager: 🔄 Intentando extender sesión por 1 hora más`);
    
    this.authService.extendSession().subscribe({
      next: () => {
        const successTime = new Date().toLocaleTimeString();
        console.log(`[${successTime}] SessionManager: ✅ Sesión extendida exitosamente por 1 hora más`);
        if (environment.session.logActivity) {
          console.log(`[${successTime}] SessionManager: 🔄 Reiniciando actividad después de extensión`);
        }
        this.updateActivity();
      },
      error: (error: any) => {
        const errorTime = new Date().toLocaleTimeString();
        console.error(`[${errorTime}] SessionManager: ❌ Error al extender sesión:`, error);
        console.log(`[${errorTime}] SessionManager: 🚪 Forzando logout por error en extensión`);
        this.forceLogout('No se pudo extender la sesión');
      }
    });
  }
  
  /**
   * Validar sesión al cargar la aplicación
   */
  private validateSessionOnLoad(): void {
    // Solo validar si no es inmediatamente después del login
    setTimeout(() => {
      this.authService.validateSession().subscribe({
        next: () => {
          if (environment.session.logActivity) {
            console.log('SessionManager: Sesión válida al cargar');
          }
        },
        error: (error) => {
          console.error('SessionManager: Error al validar sesión:', error);
          // Solo cerrar sesión si el error es realmente de sesión inválida
          if (error.status === 401) {
            this.forceLogout(SESSION_CONFIG.MESSAGES.SESSION_INVALID);
          }
        }
      });
    }, 2000); // Esperar 2 segundos antes de validar
  }
  
  /**
   * Validar sesión en navegación
   */
  public validateOnNavigation(): void {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] SessionManager: 🧭 Validando sesión en navegación`);
    console.log(`[${now}] SessionManager: 📍 URL actual: ${this.router.url}`);
    console.log(`[${now}] SessionManager: 🔐 Usuario autenticado: ${this.authService.isAuthenticated()}`);
    console.log(`[${now}] SessionManager: ⚡ Sesión activa: ${this.isSessionActive}`);
    
    // Si estamos en login, no hacer nada
    if (this.router.url.includes('/login')) {
      console.log(`[${now}] SessionManager: 🚫 En página de login, no validar sesión`);
      return;
    }
    
    // Si no hay sesión activa pero el usuario está autenticado, iniciar gestión
    if (!this.isSessionActive && this.authService.isAuthenticated()) {
      console.log(`[${now}] SessionManager: 🚀 Iniciando gestión de sesión en navegación`);
      this.initializeSessionManagement();
      return;
    }
    
    // Si no hay sesión activa, no hacer nada
    if (!this.isSessionActive) {
      console.log(`[${now}] SessionManager: ⚠️ No hay sesión activa, no validar`);
      return;
    }
    
    // Validar sesión con el backend
    console.log(`[${now}] SessionManager: 🔍 Validando sesión con backend`);
    this.authService.validateSession().subscribe({
      next: () => {
        console.log(`[${now}] SessionManager: ✅ Sesión válida en navegación`);
      },
      error: (error) => {
        console.log(`[${now}] SessionManager: ❌ Sesión inválida en navegación:`, error);
        this.forceLogout(SESSION_CONFIG.MESSAGES.SESSION_INVALID);
      }
    });
  }

  /**
   * Validar sesión en navegación con delay (para permitir redirección después del login)
   */
  public validateOnNavigationWithDelay(): void {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] SessionManager: 🧭 Validando sesión en navegación con delay`);
    
    // Esperar un poco para que Angular complete la redirección
    setTimeout(() => {
      this.validateOnNavigation();
    }, 100);
  }

  /**
   * Activar timer inmediatamente después del login (cuando se redirige al inicio)
   */
  public activateTimerAfterLogin(): void {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] SessionManager: 🚀 Activando timer después del login`);
    console.log(`[${now}] SessionManager: 📍 URL actual: ${this.router.url}`);
    
    // Solo activar si no estamos en login y el usuario está autenticado
    if (!this.router.url.includes('/login') && this.authService.isAuthenticated()) {
      console.log(`[${now}] SessionManager: ✅ Iniciando gestión de sesión después del login`);
      this.initializeSessionManagement();
    } else {
      console.log(`[${now}] SessionManager: ⚠️ No se puede activar timer - URL: ${this.router.url}, Autenticado: ${this.authService.isAuthenticated()}`);
    }
  }
  
  /**
   * Forzar cierre de sesión
   */
  private forceLogout(reason: string): void {
    const now = new Date();
    const nowTime = now.toLocaleTimeString();
    
    console.log(`[${nowTime}] SessionManager: 🚪 Forzando cierre de sesión`);
    console.log(`[${nowTime}] SessionManager: 📝 Motivo: ${reason}`);
    
    if (!this.isSessionActive) {
      console.log(`[${nowTime}] SessionManager: ⚠️ Sesión ya inactiva, ignorando logout forzado`);
      return;
    }
    
    // Limpiar todos los timers
    console.log(`[${nowTime}] SessionManager: 🧹 Limpiando todos los timers`);
    this.clearAllTimers();
    
    // Mostrar modal de logout
    console.log(`[${nowTime}] SessionManager: 📱 Mostrando modal de sesión cerrada`);
    this.showLogoutModal(reason);
    
    // Cerrar sesión
    console.log(`[${nowTime}] SessionManager: 🔐 Cerrando sesión en AuthService`);
    this.authService.logout(reason);
    
    // NO redirigir automáticamente - el usuario decidirá desde el modal
    console.log(`[${nowTime}] SessionManager: 📱 Modal de sesión cerrada mostrado - usuario decidirá redirección`);
    
    this.isSessionActive = false;
    console.log(`[${nowTime}] SessionManager: ✅ Sesión marcada como inactiva`);
  }
  
  /**
   * Mostrar modal de sesión cerrada
   */
  private showLogoutModal(reason: string): void {
    // Importar dinámicamente el componente
    import('../../shared/components/session-expired-dialog/session-expired-dialog.component').then(module => {
      this.dialog.open(module.SessionExpiredDialogComponent, {
        width: '400px',
        disableClose: true,
        data: { reason }
      });
    });
  }
  
  /**
   * Limpiar todos los timers
   */
  private clearAllTimers(): void {
    const now = new Date().toLocaleTimeString();
    let timersCleared = 0;
    
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = undefined;
      timersCleared++;
      console.log(`[${now}] SessionManager: 🧹 Timer de sesión principal limpiado`);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = undefined;
      timersCleared++;
      console.log(`[${now}] SessionManager: 🧹 Timer de advertencia limpiado`);
    }
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
      timersCleared++;
      console.log(`[${now}] SessionManager: 🧹 Timer de inactividad limpiado`);
    }
    
    console.log(`[${now}] SessionManager: ✅ Total de timers limpiados: ${timersCleared}`);
  }
  
  /**
   * Reiniciar gestión de sesión (llamado después del login)
   */
  public restartSessionManagement(): void {
    const now = new Date();
    const nowTime = now.toLocaleTimeString();
    
    console.log(`[${nowTime}] SessionManager: 🔄 Reiniciando gestión de sesión`);
    console.log(`[${nowTime}] SessionManager: 📍 URL actual: ${this.router.url}`);
    
    this.clearAllTimers();
    this.isSessionActive = false;
    
    // No inicializar en la página de login
    if (this.router.url.includes('/login')) {
      console.log(`[${nowTime}] SessionManager: 🚫 En página de login, no reiniciar gestión de sesión`);
      console.log(`[${nowTime}] SessionManager: ⏳ Esperando navegación a otra página para iniciar gestión`);
      return;
    }
    
    console.log(`[${nowTime}] SessionManager: ✅ Iniciando nueva gestión de sesión`);
    this.initializeSessionManagement();
  }
  
  /**
   * Detener gestión de sesión (llamado en logout)
   */
  public stopSessionManagement(): void {
    const now = new Date();
    const nowTime = now.toLocaleTimeString();
    
    console.log(`[${nowTime}] SessionManager: 🛑 Deteniendo gestión de sesión`);
    this.clearAllTimers();
    this.isSessionActive = false;
    console.log(`[${nowTime}] SessionManager: ✅ Gestión de sesión detenida`);
  }
}

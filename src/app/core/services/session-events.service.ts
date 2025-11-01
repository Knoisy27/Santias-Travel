import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionEventsService {
  // Eventos para comunicación entre servicios
  public loginSuccess$ = new Subject<void>();
  public logoutSuccess$ = new Subject<string>();
  
  /**
   * Emitir evento de login exitoso
   */
  emitLoginSuccess(): void {
    this.loginSuccess$.next();
  }
  
  /**
   * Emitir evento de logout
   */
  emitLogout(reason: string): void {
    this.logoutSuccess$.next(reason);
  }
}

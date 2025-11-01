import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionManagerService } from './core/services/session-manager.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Santias Travel');
  
  // Inyectar SessionManagerService para inicialización automática
  private sessionManager = inject(SessionManagerService);
  
  constructor() {
    // El SessionManagerService se inicializa automáticamente en su constructor
    // Detecta si hay sesión activa y comienza el monitoreo
  }
}

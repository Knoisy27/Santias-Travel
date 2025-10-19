import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-backend-test',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  styleUrl: './backend-test.component.scss',
  template: `
    <div class="test-container">
      <mat-card class="test-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>network_check</mat-icon>
            Prueba de Conectividad Backend
          </mat-card-title>
          <mat-card-subtitle>
            Verificar conexión con el servidor
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="test-info">
            <p><strong>URL Base:</strong> {{ baseUrl }}</p>
            <p><strong>Endpoint de Login:</strong> {{ loginUrl }}</p>
            <p><strong>Estado:</strong> 
              <span [class]="statusClass">{{ status }}</span>
            </p>
          </div>
          
          <div class="test-actions">
            <button 
              mat-raised-button 
              color="primary" 
              (click)="testConnection()"
              [disabled]="isLoading"
            >
              @if (isLoading) {
                <mat-spinner diameter="20"></mat-spinner>
                <span class="button-text">Probando...</span>
              } @else {
                <ng-container>
                  <mat-icon>refresh</mat-icon>
                  <span class="button-text">Probar Conexión</span>
                </ng-container>
              }
            </button>
            
            <button 
              mat-button 
              color="accent" 
              (click)="testLogin()"
              [disabled]="isLoading"
            >
              <mat-icon>login</mat-icon>
              Probar Login
            </button>
            
            <button 
              mat-button 
              color="warn" 
              (click)="testBlacklist()"
              [disabled]="isLoading"
            >
              <mat-icon>block</mat-icon>
              Probar Blacklist
            </button>
          </div>
          
          @if (testResults.length > 0) {
            <div class="test-results">
              <h4>Resultados de Pruebas:</h4>
              @for (result of testResults; track $index) {
                <div class="result-item" [class]="result.type">
                  <mat-icon>{{ result.icon }}</mat-icon>
                  <span>{{ result.message }}</span>
                  <small>{{ result.timestamp }}</small>
                </div>
              }
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class BackendTestComponent {
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  baseUrl = this.apiService['baseUrl'];
  loginUrl = `${this.baseUrl}/auth/login`;
  status = 'No probado';
  statusClass = 'status-warning';
  isLoading = false;
  testResults: Array<{
    type: 'success' | 'error' | 'warning';
    icon: string;
    message: string;
    timestamp: string;
  }> = [];

  testConnection(): void {
    this.isLoading = true;
    this.status = 'Probando...';
    this.statusClass = 'status-warning';

    // Probar endpoint de health o info
    this.apiService.get<any>('health').subscribe({
      next: (response) => {
        this.isLoading = false;
        this.status = 'Conectado';
        this.statusClass = 'status-success';
        this.addResult('success', 'check_circle', 'Conexión exitosa con el backend');
        this.snackBar.open('✅ Backend conectado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.isLoading = false;
        this.status = 'Error de conexión';
        this.statusClass = 'status-error';
        this.addResult('error', 'error', `Error de conexión: ${error.status} - ${error.statusText}`);
        this.snackBar.open('❌ Error al conectar con el backend', 'Cerrar', { duration: 5000 });
      }
    });
  }

  testLogin(): void {
    this.isLoading = true;
    this.addResult('warning', 'info', 'Probando login con credenciales de prueba...');

    const testCredentials = {
      username: 'admin',
      password: 'admin123'
    };

    this.apiService.post<any>('auth/login', testCredentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.addResult('success', 'check_circle', 'Login de prueba exitoso');
        this.snackBar.open('✅ Login de prueba exitoso', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.isLoading = false;
        this.addResult('error', 'error', `Error en login: ${error.status} - ${error.statusText}`);
        this.snackBar.open('❌ Error en login de prueba', 'Cerrar', { duration: 5000 });
      }
    });
  }

  testBlacklist(): void {
    this.isLoading = true;
    this.addResult('warning', 'info', 'Probando información de blacklist...');

    this.apiService.get<any>('auth/blacklist-info').subscribe({
      next: (response) => {
        this.isLoading = false;
        this.addResult('success', 'check_circle', `Blacklist info: ${response.message}`);
        this.snackBar.open('✅ Información de blacklist obtenida', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.isLoading = false;
        this.addResult('error', 'error', `Error al obtener blacklist: ${error.status} - ${error.statusText}`);
        this.snackBar.open('❌ Error al obtener información de blacklist', 'Cerrar', { duration: 5000 });
      }
    });
  }

  private addResult(type: 'success' | 'error' | 'warning', icon: string, message: string): void {
    this.testResults.unshift({
      type,
      icon,
      message,
      timestamp: new Date().toLocaleTimeString()
    });
  }
}

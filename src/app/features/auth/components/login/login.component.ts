import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  styleUrl: './login.component.scss',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title class="login-title">
            <mat-icon>admin_panel_settings</mat-icon>
            Acceso Administrativo
          </mat-card-title>
          <mat-card-subtitle>
            Solo para administradores y agentes
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input 
                matInput 
                type="text" 
                formControlName="username"
                placeholder="admin"
                autocomplete="username"
              >
              <mat-icon matSuffix>person</mat-icon>
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <mat-error>
                  @if (loginForm.get('username')?.errors?.['required']) {
                    El usuario es requerido
                  } @else if (loginForm.get('username')?.errors?.['minlength']) {
                    Mínimo 3 caracteres
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input 
                matInput 
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
              >
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword.set(!hidePassword())"
                [attr.aria-label]="'Ocultar contraseña'"
                [attr.aria-pressed]="hidePassword()"
              >
                <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <mat-error>
                  @if (loginForm.get('password')?.errors?.['required']) {
                    La contraseña es requerida
                  } @else if (loginForm.get('password')?.errors?.['minlength']) {
                    Mínimo 6 caracteres
                  }
                </mat-error>
              }
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="login-button full-width"
              [disabled]="loginForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
                <span class="button-text">Iniciando sesión...</span>
              } @else {
                <ng-container>
                  <mat-icon>login</mat-icon>
                  <span class="button-text">Iniciar Sesión</span>
                </ng-container>
              }
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions class="login-actions">
          <button 
            mat-button 
            color="accent" 
            (click)="goBack()"
            [disabled]="isLoading()"
          >
            <mat-icon>arrow_back</mat-icon>
            Volver al inicio
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      
      const credentials: LoginRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          const fullName = `${response.nombre} ${response.apellido}`.trim();
          this.snackBar.open(
            `¡Bienvenido ${fullName}!`, 
            'Cerrar', 
            { duration: 3000 }
          );
          
          // Redirigir a la URL original o al inicio después del login exitoso
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.isLoading.set(false);
          
          let errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
          
          if (error.status === 403) {
            errorMessage = 'Acceso denegado. Verifica tus credenciales o contacta al administrador.';
          } else if (error.status === 401) {
            errorMessage = 'Credenciales inválidas. Verifica tu usuario y contraseña.';
          } else if (error.status === 404) {
            errorMessage = 'Servicio no encontrado. Verifica que el backend esté ejecutándose.';
          } else if (error.status === 0) {
            errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 9090.';
          } else if (error.status >= 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde.';
          }
          
          this.snackBar.open(
            errorMessage, 
            'Cerrar', 
            { duration: 7000 }
          );
          
          console.error('Error detallado en login:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}

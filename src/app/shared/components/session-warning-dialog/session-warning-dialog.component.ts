import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export interface SessionWarningData {
  message: string;
  timeLeft: number;
  canExtend: boolean;
}

@Component({
  selector: 'app-session-warning-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Advertencia de Sesión</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      <p><strong>Tiempo restante: {{ timeLeft }} segundos</strong></p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="extendSession()" *ngIf="data.canExtend" color="primary">
        Extender 1 hora
      </button>
      <button mat-button (click)="logout()" color="warn">
        Cerrar sesión
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      margin: 16px 0;
    }
    
    mat-dialog-actions {
      gap: 8px;
    }
    
    p {
      margin: 8px 0;
    }
  `]
})
export class SessionWarningDialogComponent implements OnInit, OnDestroy {
  timeLeft: number;
  private countdownInterval?: number;
  
  constructor(
    public dialogRef: MatDialogRef<SessionWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SessionWarningData
  ) {
    this.timeLeft = data.timeLeft;
  }
  
  ngOnInit(): void {
    this.startCountdown();
  }
  
  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
  
  private startCountdown(): void {
    this.countdownInterval = window.setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.countdownInterval);
        this.dialogRef.close('timeout');
      }
    }, 1000);
  }
  
  extendSession(): void {
    this.dialogRef.close('extend');
  }
  
  logout(): void {
    this.dialogRef.close('logout');
  }
}

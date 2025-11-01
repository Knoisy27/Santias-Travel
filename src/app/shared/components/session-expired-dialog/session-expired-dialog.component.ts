import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface SessionExpiredData {
  reason: string;
}

@Component({
  selector: 'app-session-expired-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div mat-dialog-title>
      <span>Sesión Cerrada</span>
      <button mat-icon-button (click)="goToHome()" class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content>
      <p>Tu sesión ha sido cerrada automáticamente.</p>
      <p><strong>Motivo:</strong> {{ data.reason }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="goToLogin()" color="primary">
        Ir a Login
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      margin: 16px 0;
    }
    
    p {
      margin: 8px 0;
    }
    
    strong {
      color: #d32f2f;
    }
    
    .close-button {
      position: absolute;
      right: 8px;
      top: 8px;
    }
    
    div[mat-dialog-title] {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
  `]
})
export class SessionExpiredDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<SessionExpiredDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SessionExpiredData,
    private router: Router
  ) {}
  
  goToLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }
}

import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NewsletterDialogComponent } from '../components/newsletter-dialog/newsletter-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NewsletterDialogService {
  private dialog = inject(MatDialog);
  private isDialogOpen = false;

  openNewsletterDialog(): Observable<boolean> {
    // Prevenir múltiples instancias del dialog
    if (this.isDialogOpen) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(NewsletterDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: true,
      restoreFocus: true,
      panelClass: 'newsletter-dialog-panel'
    });

    // Resetear el flag cuando se cierre el dialog
    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
    });

    return dialogRef.afterClosed();
  }

  // Método para abrir el dialog con delay (como el popup original)
  scheduleNewsletterDialog(delayMs: number = 10000): void {
    if (typeof window !== 'undefined') {
      // Verificar si ya se mostró en esta sesión
      const hasShownNewsletter = sessionStorage.getItem('newsletter-shown');
      
      if (!hasShownNewsletter) {
        setTimeout(() => {
          this.openNewsletterDialog().subscribe(result => {
            if (result) {
              // Marcar como mostrado si se suscribió
              sessionStorage.setItem('newsletter-shown', 'true');
            }
          });
        }, delayMs);
      }
    }
  }
}

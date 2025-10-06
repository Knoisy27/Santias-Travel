import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { NotificationService } from '../../services/notification.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './whatsapp-float.component.html',
  styleUrl: './whatsapp-float.component.scss'
})
export class WhatsappFloatComponent {
  private notificationService = inject(NotificationService);
  
  phoneNumber = signal(APP_CONSTANTS.AGENCY_INFO.whatsapp);
  message = signal(APP_CONSTANTS.WHATSAPP_MESSAGES.default);

  openWhatsApp(): void {
    const encodedMessage = encodeURIComponent(this.message());
    const whatsappUrl = `https://wa.me/${this.phoneNumber()}?text=${encodedMessage}`;
    
    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined') {
      try {
        window.open(whatsappUrl, '_blank');
        this.notificationService.info(
          'Abriendo WhatsApp... Si no se abre automáticamente, verifica tu configuración.',
          'Entendido',
          APP_CONSTANTS.NOTIFICATION_CONFIG.duration.short
        );
      } catch (error) {
        this.notificationService.error(
          `No se pudo abrir WhatsApp. Puedes contactarnos al ${APP_CONSTANTS.AGENCY_INFO.phone}`,
          'Copiar número'
        ).onAction().subscribe(() => {
          this.copyPhoneNumber();
        });
      }
    } else {
      this.notificationService.warning(
        'WhatsApp no está disponible en este momento',
        'Entendido'
      );
    }
  }

  private copyPhoneNumber(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(APP_CONSTANTS.AGENCY_INFO.phone).then(() => {
        this.notificationService.showCopySuccess();
      }).catch(() => {
        this.notificationService.error('No se pudo copiar el número');
      });
    }
  }
}

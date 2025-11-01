import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../core/services/utils.service';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss'
})
export class CtaSectionComponent {
  private utilsService = inject(UtilsService);

  readonly title = '¿Listo para vivir una nueva experiencia que marcará tu vida?';
  readonly buttonText = 'Escríbenos y hazlo posible';

  openWhatsApp(): void {
    const message = '¡Hola! Estoy listo para vivir una nueva experiencia que marcará mi vida. Me gustaría conocer más sobre sus opciones de viaje.';
    const whatsappNumber = APP_CONSTANTS.AGENCY_INFO.whatsapp;
    this.utilsService.openWhatsApp(whatsappNumber, message);
  }
}


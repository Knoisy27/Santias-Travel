import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../core/services/utils.service';
import { APP_CONSTANTS } from '../../../../core/constants/app.constants';
import { CTA_SECTION_CONFIG } from '../../config/cta-section.config';
import { VIAJES_GRUPALES_CONFIG } from '../../../viajes-grupales/config/viajes-grupales.config';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss'
})
export class CtaSectionComponent {
  @Input() viajeNombre?: string;
  @Input() viajePrecio?: string;
  @Input() viajeDescripcion?: string;
  @Input() viajeFechas?: string;

  private utilsService = inject(UtilsService);

  readonly config = CTA_SECTION_CONFIG;
  // Usamos la config de viajes grupales para acceder a la plantilla del mensaje de whatsapp
  // Esto asume que la estructura del mensaje es la misma para ambos tipos de viaje, lo cual es cierto.
  private detailConfig = VIAJES_GRUPALES_CONFIG.detail; 

  openWhatsApp(): void {
    let message: string;

    if (this.viajeNombre) {
       // Si hay un viaje específico, usamos el formato de mensaje de detalle
       message = this.detailConfig.messages.whatsappMessage(
        this.viajeNombre,
        this.viajeDescripcion || '',
        this.viajePrecio,
        this.viajeFechas
      );
    } else {
      // Mensaje genérico por defecto
      message = '¡Hola! Estoy listo para vivir una nueva experiencia que marcará mi vida. Me gustaría conocer más sobre sus opciones de viaje.';
    }

    const whatsappNumber = APP_CONSTANTS.AGENCY_INFO.whatsapp;
    this.utilsService.openWhatsApp(whatsappNumber, message);
  }
}

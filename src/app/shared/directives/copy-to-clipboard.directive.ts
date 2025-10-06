import { Directive, ElementRef, Input, HostListener, inject } from '@angular/core';
import { UtilsService } from '../../core/services/utils.service';
import { NotificationService } from '../services/notification.service';

@Directive({
  selector: '[appCopyToClipboard]',
  standalone: true
})
export class CopyToClipboardDirective {
  @Input() appCopyToClipboard: string = '';
  @Input() copyMessage: string = 'Texto copiado al portapapeles';
  @Input() errorMessage: string = 'No se pudo copiar el texto';

  private element = inject(ElementRef);
  private utilsService = inject(UtilsService);
  private notificationService = inject(NotificationService);

  @HostListener('click')
  async onClick(): Promise<void> {
    const textToCopy = this.getTextToCopy();
    
    if (!textToCopy) {
      this.notificationService.warning('No hay texto para copiar');
      return;
    }

    const success = await this.utilsService.copyToClipboard(textToCopy);
    
    if (success) {
      this.notificationService.success(this.copyMessage, 'Copiado');
    } else {
      this.notificationService.error(this.errorMessage, 'Error');
    }
  }

  private getTextToCopy(): string {
    // Si se especifica texto directamente
    if (this.appCopyToClipboard) {
      return this.appCopyToClipboard;
    }

    // Intentar obtener texto del elemento
    const element = this.element.nativeElement;
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      return element.value;
    }
    
    if (element.textContent) {
      return element.textContent.trim();
    }
    
    if (element.innerText) {
      return element.innerText.trim();
    }

    return '';
  }
}

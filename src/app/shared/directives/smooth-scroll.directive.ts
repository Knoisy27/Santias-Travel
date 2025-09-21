import { Directive, ElementRef, Input, HostListener, inject } from '@angular/core';
import { UtilsService } from '../../core/services/utils.service';

@Directive({
  selector: '[appSmoothScroll]',
  standalone: true
})
export class SmoothScrollDirective {
  @Input() appSmoothScroll: string = '';
  @Input() scrollOffset: number = 0;
  @Input() scrollBehavior: ScrollBehavior = 'smooth';

  private element = inject(ElementRef);
  private utilsService = inject(UtilsService);

  @HostListener('click')
  onClick(): void {
    if (this.appSmoothScroll) {
      this.scrollToTarget();
    } else {
      this.scrollToTop();
    }
  }

  private scrollToTarget(): void {
    this.utilsService.scrollToElement(this.appSmoothScroll, this.scrollOffset);
  }

  private scrollToTop(): void {
    this.utilsService.scrollToTop();
  }
}

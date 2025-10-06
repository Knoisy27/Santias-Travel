import { Component, Input, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Destination } from '../../../../core/interfaces/destination.interface';

@Component({
  selector: 'app-experiences-section',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './experiences-section.component.html',
  styleUrl: './experiences-section.component.scss'
})
export class ExperiencesSectionComponent implements OnInit, OnDestroy {
  @Input() destinations: Destination[] = [];
  
  private router = inject(Router);
  private autoSlideInterval?: number;
  
  currentSlide = signal(0);
  slideWidth = 320; // Ancho de cada card + gap
  slidesToShow = 3; // Mostrar 3 cards a la vez en desktop
  
  // Computed properties
  maxSlides = computed(() => Math.max(0, this.destinations.length - this.slidesToShow));
  indicators = computed(() => Array(Math.ceil(this.destinations.length / this.slidesToShow)).fill(0));
  
  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  private startAutoSlide(): void {
    // Verificar si estamos en el navegador (no en SSR)
    if (typeof window !== 'undefined') {
      this.autoSlideInterval = window.setInterval(() => {
        this.nextSlide();
      }, 5000); // Cambiar cada 5 segundos
    }
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    const current = this.currentSlide();
    const max = this.maxSlides();
    
    if (current < max) {
      this.currentSlide.set(current + 1);
    } else {
      this.currentSlide.set(0); // Volver al inicio
    }
  }

  prevSlide(): void {
    const current = this.currentSlide();
    const max = this.maxSlides();
    
    if (current > 0) {
      this.currentSlide.set(current - 1);
    } else {
      this.currentSlide.set(max); // Ir al final
    }
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }

  viewDestination(destinationId: string): void {
    this.router.navigate(['/destinos', destinationId]);
  }

  viewAllDestinations(): void {
    this.router.navigate(['/destinos']);
  }

  // Pausar auto-slide cuando el usuario interactúa
  onUserInteraction(): void {
    this.stopAutoSlide();
    setTimeout(() => this.startAutoSlide(), 10000); // Reanudar después de 10 segundos
  }

  // Obtener el índice de la card central visible
  getCenterCardIndex(): number {
    return Math.floor(this.currentSlide() + 1.5); // Aproximación de la card central
  }

  // Manejar hover en las cards
  onCardHover(cardIndex: number): void {
    // Pausar auto-slide durante hover
    this.stopAutoSlide();
  }

  onCardLeave(): void {
    // Reanudar auto-slide después del hover
    this.startAutoSlide();
  }
}

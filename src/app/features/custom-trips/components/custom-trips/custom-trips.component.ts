import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService, ViajeIndividual } from '../../../../core/services/trips.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-trips.component.html',
  styleUrl: './custom-trips.component.scss'
})
export class CustomTripsComponent implements OnInit, OnDestroy {
  viajes: ViajeIndividual[] = [];
  showMockTrip = true;
  private destroy$ = new Subject<void>();

  constructor(
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.tripsService.getViajesIndividuales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (viajes) => {
          this.viajes = viajes || [];
          this.showMockTrip = this.viajes.length === 0;
          
          this.ngZone.run(() => {
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error al cargar viajes:', error);
          this.showMockTrip = true;
          this.viajes = [];
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByViaje(index: number, viaje: ViajeIndividual): number {
    return viaje?.id ?? index;
  }
}

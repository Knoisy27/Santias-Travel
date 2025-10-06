import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Detalle del Destino</h1>
      <p>Próximamente: Información detallada del destino</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class DestinationDetailComponent {}

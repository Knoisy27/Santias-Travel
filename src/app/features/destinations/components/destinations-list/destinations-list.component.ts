import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-destinations-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Viajes Grupales</h1>
      <p>Próximamente: Lista de destinos para viajes grupales</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class DestinationsListComponent {}

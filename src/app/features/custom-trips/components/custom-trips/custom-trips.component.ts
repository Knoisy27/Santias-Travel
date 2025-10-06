import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-trips',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Viajes a tu Medida</h1>
      <p>Próximamente: Formulario para viajes personalizados</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class CustomTripsComponent {}

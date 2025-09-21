import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Sobre Nosotros</h1>
      <p>Próximamente: Historia y misión de la agencia</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class AboutComponent {}

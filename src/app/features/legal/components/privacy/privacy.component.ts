import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Política de Privacidad</h1>
      <p>Próximamente: Política de privacidad y manejo de datos</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class PrivacyComponent {}

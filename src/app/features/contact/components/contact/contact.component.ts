import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  template: `
    <section class="contact-section">
      <div class="container">
        <div class="contact-header">
          <h1>Contáctanos</h1>
          <p class="lead">¿Listo para tu próxima aventura? Estamos aquí para ayudarte a crear el viaje perfecto.</p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-phone"></i>
              </div>
              <h3>Teléfono</h3>
              <p>+57 (1) 234-5678</p>
              <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>info@santiastravel.com</p>
              <p>Respuesta en 24 horas</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h3>Oficina</h3>
              <p>Calle 123 #45-67</p>
              <p>Bogotá, Colombia</p>
            </div>
          </div>
          
          <app-contact-form></app-contact-form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      padding: 80px 0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: calc(100vh - 200px);
    }

    .contact-header {
      text-align: center;
      margin-bottom: 60px;
      
      h1 {
        font-size: 3rem;
        color: #1e293b;
        margin-bottom: 20px;
        
        @media (max-width: 768px) {
          font-size: 2.5rem;
        }
      }
      
      .lead {
        font-size: 1.25rem;
        color: #64748b;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
      }
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .info-card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }
      
      .info-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        
        i {
          color: white;
          font-size: 24px;
        }
      }
      
      h3 {
        color: #1e293b;
        margin-bottom: 10px;
        font-size: 1.25rem;
      }
      
      p {
        color: #64748b;
        margin: 5px 0;
        
        &:first-of-type {
          font-weight: 600;
          color: #374151;
        }
      }
    }

    @media (max-width: 768px) {
      .contact-section {
        padding: 60px 0;
      }
      
      .contact-info {
        order: 2;
      }
      
      .info-card {
        padding: 24px;
      }
    }
  `]
})
export class ContactComponent {}

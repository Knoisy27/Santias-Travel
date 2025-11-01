import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { AgencyService } from '../../../core/services/agency.service';
import { AgencyInfo } from '../../../core/interfaces/agency.interface';
import { AuthService, User } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockDataService } from '../../../core/services/mock-data.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TitleCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private mockDataService = inject(MockDataService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  
  agencyInfo = signal<AgencyInfo | null>(null);
  isMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  
  // Variables para el triple click
  private clickCount = 0;
  private clickTimeout: any;

  ngOnInit(): void {
    this.loadAgencyInfo();
  }

  private loadAgencyInfo(): void {
    // TODO: Comentado temporalmente hasta que el backend esté listo
    // this.agencyService.getAgencyInfo().subscribe({
    //   next: (info) => this.agencyInfo.set(info),
    //   error: (error) => console.error('Error cargando información de la agencia:', error)
    // });
    
    // Usar datos mock centralizados
    this.mockDataService.getAgencyInfo().subscribe({
      next: (info) => this.agencyInfo.set(info),
      error: (error) => {
        this.agencyInfo.set(APP_CONSTANTS.AGENCY_INFO);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();
    
    // Si estamos en la página home, hacer scroll directo
    if (this.router.url === '/') {
      this.scrollToElement(sectionId);
    } else {
      // Si no estamos en home, navegar y luego hacer scroll
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToElement(sectionId), 100);
      });
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openWhatsApp(): void {
    const agencyInfo = this.agencyInfo();
    if (agencyInfo?.whatsapp) {
      const cleanPhone = agencyInfo.whatsapp.replace(/\D/g, '');
      const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus destinos de viaje.');
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }
  }

  /**
   * Manejar triple click en el nombre de la marca
   * - Si NO está autenticado: Accede al login
   * - Si SÍ está autenticado: Muestra información del usuario
   */
  onBrandNameClick(event: Event): void {
    this.clickCount++;
    
    // Limpiar timeout anterior si existe
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
    
    // Si es el tercer click
    if (this.clickCount === 3) {
      event.preventDefault(); // Prevenir la navegación del enlace
      event.stopPropagation(); // Detener la propagación del evento
      
      if (this.isAuthenticated) {
        // Usuario autenticado: Mostrar información
        const user = this.currentUser;
        this.snackBar.open(
          `¡Hola ${user?.name}! Ya estás logueado como ${user?.role}. Usa el menú de usuario para cerrar sesión.`,
          'Cerrar',
          { 
            duration: 4000,
            panelClass: ['info-snackbar']
          }
        );
      } else {
        // Usuario no autenticado: Ir al login
        this.router.navigate(['/login']);
      }
      
      this.clickCount = 0;
      return;
    }
    
    // Resetear contador después de 1 segundo sin clicks
    this.clickTimeout = setTimeout(() => {
      this.clickCount = 0;
    }, 1000);
  }

  /**
   * Obtener el usuario autenticado
   */
  get currentUser(): User | null {
    return this.authService.user();
  }

  /**
   * Verificar si el usuario está autenticado
   */
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Toggle del menú de usuario
   */
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(isOpen => !isOpen);
  }

  /**
   * Cerrar menú de usuario
   */
  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    // Cerrar menú primero
    this.closeUserMenu();
    
    // Ejecutar logout (solo limpieza local, sin notificar backend)
    this.authService.logoutLocal();
    
    // Redirigir inmediatamente
    this.router.navigate(['/']).then(() => {
      // Forzar recarga de la página para limpiar cualquier estado residual
      window.location.reload();
    });
  }
}

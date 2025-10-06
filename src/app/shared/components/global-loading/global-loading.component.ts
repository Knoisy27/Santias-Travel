import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="global-loading-overlay" [class.active]="isLoading">
      <div class="loading-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <div class="loading-message">{{ loadingMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease-in-out;
    }

    .global-loading-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .loading-container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      text-align: center;
      min-width: 200px;
    }

    .loading-spinner {
      margin-bottom: 16px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    .loading-message {
      color: #374151;
      font-size: 16px;
      font-weight: 500;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .loading-container {
        margin: 20px;
        padding: 24px;
        min-width: 150px;
      }

      .spinner {
        width: 32px;
        height: 32px;
        border-width: 3px;
      }

      .loading-message {
        font-size: 14px;
      }
    }
  `]
})
export class GlobalLoadingComponent implements OnInit, OnDestroy {
  private loadingService = inject(LoadingService);
  private subscriptions = new Subscription();

  isLoading = false;
  loadingMessage = 'Cargando...';

  ngOnInit(): void {
    // Suscribirse al estado de loading
    this.subscriptions.add(
      this.loadingService.loading$.subscribe(loading => {
        this.isLoading = loading;
      })
    );

    // Suscribirse a los mensajes de loading
    this.subscriptions.add(
      this.loadingService.loadingMessage$.subscribe(message => {
        this.loadingMessage = message;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

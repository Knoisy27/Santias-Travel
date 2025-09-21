import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';

let activeRequests = 0;

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Solo mostrar loading para requests que no sean de assets
  if (!shouldShowLoading(req.url)) {
    return next(req);
  }

  activeRequests++;
  if (activeRequests === 1) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        loadingService.hide();
      }
    })
  );
};

function shouldShowLoading(url: string): boolean {
  // No mostrar loading para assets estáticos
  const staticAssets = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return !staticAssets.some(asset => url.includes(asset));
}

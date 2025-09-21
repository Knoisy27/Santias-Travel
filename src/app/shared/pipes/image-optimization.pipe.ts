import { Pipe, PipeTransform, inject } from '@angular/core';
import { ImageOptimizationService } from '../../core/services/image-optimization.service';

@Pipe({
  name: 'optimizeImage',
  standalone: true
})
export class OptimizeImagePipe implements PipeTransform {
  private imageService = inject(ImageOptimizationService);

  transform(
    imageUrl: string, 
    width?: number, 
    height?: number, 
    quality: number = 80
  ): string {
    if (!imageUrl) {
      return this.imageService.getPlaceholderImageUrl();
    }

    return this.imageService.generateOptimizedImageUrl(imageUrl, width, height, quality);
  }
}

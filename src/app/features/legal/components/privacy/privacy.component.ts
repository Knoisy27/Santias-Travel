import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SEOService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent implements OnInit {
  private seoService = inject(SEOService);

  ngOnInit(): void {
    // Actualizar meta tags SEO
    this.seoService.updatePrivacyPageMeta();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

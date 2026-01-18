import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SEOService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent implements OnInit {
  private seoService = inject(SEOService);

  ngOnInit(): void {
    // Actualizar meta tags SEO
    this.seoService.updateTermsPageMeta();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

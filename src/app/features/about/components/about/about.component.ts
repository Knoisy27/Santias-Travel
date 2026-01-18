import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { SEOService } from '../../../../core/services/seo.service';

register();

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AboutComponent implements OnInit, AfterViewInit {
  private seoService = inject(SEOService);

  slider1Images: string[] = [
    '/assets/images/nosotros/slider1/slider1 (1).jpeg',
    '/assets/images/nosotros/slider1/slider1 (2).jpeg',
    '/assets/images/nosotros/slider1/slider1 (3).jpeg',
    '/assets/images/nosotros/slider1/slider1 (4).jpeg'
  ];

  slider2Images: string[] = [
    '/assets/images/nosotros/slider2/slider2 (1).jpeg',
    '/assets/images/nosotros/slider2/slider2 (2).jpeg',
    '/assets/images/nosotros/slider2/slider2 (3).JPG',
    '/assets/images/nosotros/slider2/slider2 (4).JPG'
  ];

  ngOnInit(): void {
    // Actualizar meta tags SEO
    this.seoService.updateAboutPageMeta();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    this.initSliders();
  }

  private initSliders(): void {
    const slider1 = document.querySelector('#slider1') as any;
    const slider2 = document.querySelector('#slider2') as any;

    if (slider1) {
      Object.assign(slider1, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
      slider1.initialize();
    }

    if (slider2) {
      Object.assign(slider2, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
      slider2.initialize();
    }
  }
}

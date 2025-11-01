import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_CONSTANTS } from '../constants/app.constants';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private title = inject(Title);
  private meta = inject(Meta);

  private readonly defaultData: SEOData = {
    title: 'Santias Travel - Agencia de Viajes',
    description: 'Tu agencia de viajes de confianza. Descubre destinos increíbles y vive experiencias únicas. Más de 7 años de experiencia en el sector turístico.',
    keywords: ['viajes', 'turismo', 'destinos', 'vacaciones', 'agencia de viajes', 'Colombia', 'viajes internacionales'],
    image: '/assets/images/og-image.jpg',
    url: 'https://santiastravel.com',
    type: 'website',
    author: 'Santias Travel'
  };

  /**
   * Actualiza los meta tags de la página
   */
  updateMetaTags(data: SEOData): void {
    const seoData = { ...this.defaultData, ...data };
    
    // Título de la página
    this.title.setTitle(seoData.title!);
    
    // Meta tags básicos
    this.meta.updateTag({ name: 'description', content: seoData.description! });
    this.meta.updateTag({ name: 'keywords', content: seoData.keywords!.join(', ') });
    this.meta.updateTag({ name: 'author', content: seoData.author! });
    
    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: seoData.title! });
    this.meta.updateTag({ property: 'og:description', content: seoData.description! });
    this.meta.updateTag({ property: 'og:image', content: seoData.image! });
    this.meta.updateTag({ property: 'og:url', content: seoData.url! });
    this.meta.updateTag({ property: 'og:type', content: seoData.type! });
    this.meta.updateTag({ property: 'og:site_name', content: 'Santias Travel' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_CO' });
    
    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seoData.title! });
    this.meta.updateTag({ name: 'twitter:description', content: seoData.description! });
    this.meta.updateTag({ name: 'twitter:image', content: seoData.image! });
    
    // Meta tags adicionales para artículos
    if (seoData.type === 'article') {
      if (seoData.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: seoData.publishedTime });
      }
      if (seoData.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: seoData.modifiedTime });
      }
      if (seoData.section) {
        this.meta.updateTag({ property: 'article:section', content: seoData.section });
      }
      if (seoData.tags) {
        seoData.tags.forEach(tag => {
          this.meta.addTag({ property: 'article:tag', content: tag });
        });
      }
    }
    
    // Meta tags técnicos
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'googlebot', content: 'index, follow' });
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' });
    this.meta.updateTag({ name: 'theme-color', content: '#3B5998' });
  }

  /**
   * Actualiza meta tags para la página de inicio
   */
  updateHomePageMeta(): void {
    this.updateMetaTags({
      title: 'Santias Travel - Agencia de Viajes | Destinos Increíbles',
      description: 'Descubre los mejores destinos del mundo con Santias Travel. Más de 7 años de experiencia, 50+ destinos disponibles y más de 106,000 clientes satisfechos.',
      keywords: [
        'agencia de viajes',
        'destinos internacionales',
        'viajes a Europa',
        'viajes a Asia',
        'viajes a América',
        'paquetes turísticos',
        'viajes grupales',
        'viajes a tu medida',
        'Colombia'
      ]
    });
  }

  /**
   * Actualiza meta tags para página de viajes grupales
   */
  updateGroupTripsPageMeta(): void {
    this.updateMetaTags({
      title: 'Viajes Grupales - Santias Travel | Explora el Mundo',
      description: 'Explora nuestros viajes grupales disponibles. Descubre las mejores experiencias de viaje compartidas con Santias Travel.',
      keywords: [
        'viajes grupales',
        'viajes compartidos',
        'viajes internacionales',
        'grupos de viaje',
        'Santias Travel'
      ]
    });
  }

  /**
   * Actualiza meta tags para página de contacto
   */
  updateContactPageMeta(): void {
    this.updateMetaTags({
      title: 'Contacto - Santias Travel | Planifica tu Viaje',
      description: 'Ponte en contacto con Santias Travel. Nuestros expertos en viajes están listos para ayudarte a planificar tu próxima aventura.',
      keywords: [
        'contacto',
        'agencia de viajes',
        'asesoría de viajes',
        'consultoría turística',
        'WhatsApp',
        'teléfono'
      ]
    });
  }

  /**
   * Actualiza meta tags para página sobre nosotros
   */
  updateAboutPageMeta(): void {
    this.updateMetaTags({
      title: 'Sobre Nosotros - Santias Travel | Nuestra Historia',
      description: 'Conoce la historia de Santias Travel. Más de 7 años creando experiencias de viaje únicas para nuestros clientes en Colombia.',
      keywords: [
        'sobre nosotros',
        'historia',
        'empresa',
        'equipo',
        'experiencia',
        'confianza',
        'Santias Travel'
      ]
    });
  }

  /**
   * Genera structured data para JSON-LD
   */
  generateStructuredData(type: 'Organization' | 'TravelAgency' | 'LocalBusiness' = 'TravelAgency'): string {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      name: 'Santias Travel',
      description: 'Tu agencia de viajes de confianza',
      url: 'https://santiastravel.com',
      logo: 'https://santiastravel.com/assets/images/logo.png',
      image: 'https://santiastravel.com/assets/images/og-image.jpg',
      telephone: '+57 300 123 4567',
      email: 'info@santiastravel.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bogotá, Colombia',
        addressLocality: 'Bogotá',
        addressCountry: 'CO'
      },
      sameAs: [
        'https://facebook.com/santiastravel',
        'https://instagram.com/santiastravel'
      ]
    };

    if (type === 'TravelAgency') {
      return JSON.stringify({
        ...baseData,
        '@type': 'TravelAgency',
        serviceArea: {
          '@type': 'Country',
          name: 'Colombia'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Paquetes de Viaje',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Viajes a Europa'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Viajes a Asia'
              }
            }
          ]
        }
      });
    }

    return JSON.stringify(baseData);
  }

  /**
   * Agrega structured data al head
   */
  addStructuredData(data: string): void {
    // Remover structured data existente
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Agregar nuevo structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = data;
    document.head.appendChild(script);
  }
}

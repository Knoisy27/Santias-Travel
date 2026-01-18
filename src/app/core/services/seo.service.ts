import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  canonicalUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private title = inject(Title);
  private meta = inject(Meta);
  private platformId = inject(PLATFORM_ID);

  private readonly baseUrl = 'https://santiastravel.cloud';
  
  private readonly defaultData: SEOData = {
    title: 'Santias Travel - Agencia de Viajes en Colombia',
    description: 'Santias Travel - Agencia de viajes en Tuluá, Colombia. Viajes grupales e individuales a destinos nacionales e internacionales. Más de 3 años de experiencia y 5000+ viajes realizados.',
    keywords: [
      'agencia de viajes Colombia',
      'viajes grupales Colombia', 
      'paquetes turísticos',
      'viajes Tuluá',
      'viajes Valle del Cauca',
      'tours internacionales',
      'viajes a México',
      'viajes al Caribe',
      'Santa Marta',
      'San Andrés',
      'Cancún',
      'República Dominicana'
    ],
    image: 'https://santiastravel.cloud/assets/images/og-image.jpg',
    url: 'https://santiastravel.cloud',
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
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    this.meta.updateTag({ name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' });
    this.meta.updateTag({ name: 'theme-color', content: '#03A047' });
    
    // URL Canónica
    if (seoData.canonicalUrl) {
      this.updateCanonicalUrl(seoData.canonicalUrl);
    }
  }

  /**
   * Actualiza la URL canónica de la página
   */
  updateCanonicalUrl(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
  }

  /**
   * Actualiza meta tags para la página de inicio
   */
  updateHomePageMeta(): void {
    this.updateMetaTags({
      title: 'Santias Travel - Agencia de Viajes en Colombia | Viajes Grupales e Individuales',
      description: 'Santias Travel - Tu agencia de viajes de confianza en Tuluá, Colombia. Viajes grupales e individuales a México, Caribe, San Andrés, Santa Marta y más. +5000 viajes realizados. WhatsApp: +57 304 267 2662',
      keywords: [
        'agencia de viajes Colombia',
        'viajes grupales Colombia',
        'paquetes turísticos Colombia',
        'viajes Tuluá',
        'viajes Valle del Cauca',
        'viajes a México desde Colombia',
        'viajes al Caribe',
        'San Andrés paquetes',
        'Santa Marta tours',
        'Cancún desde Colombia',
        'viajes económicos',
        'agencia de viajes confiable'
      ],
      url: this.baseUrl,
      canonicalUrl: this.baseUrl
    });
  }

  /**
   * Actualiza meta tags para página de viajes grupales
   */
  updateGroupTripsPageMeta(): void {
    this.updateMetaTags({
      title: 'Viajes Grupales Colombia - Santias Travel | Tours y Paquetes en Grupo',
      description: 'Descubre nuestros viajes grupales desde Colombia. Paquetes todo incluido a México, Caribe, San Andrés, Santa Marta, La Guajira y más. Grupos pequeños, precios accesibles. Reserva ahora.',
      keywords: [
        'viajes grupales Colombia',
        'tours en grupo',
        'paquetes grupales',
        'viajes compartidos',
        'grupos de viaje Colombia',
        'tours México grupales',
        'viajes Caribe grupo',
        'San Andrés grupos',
        'Santa Marta grupos',
        'La Guajira tours',
        'viajes económicos en grupo'
      ],
      url: `${this.baseUrl}/viajes-grupales`,
      canonicalUrl: `${this.baseUrl}/viajes-grupales`
    });
  }

  /**
   * Actualiza meta tags para página de viajes a tu medida
   */
  updateCustomTripsPageMeta(): void {
    this.updateMetaTags({
      title: 'Viajes a Tu Medida - Santias Travel | Paquetes Personalizados Colombia',
      description: 'Diseña tu viaje ideal con Santias Travel. Paquetes personalizados a cualquier destino. Viajes individuales, en pareja o familia. Asesoría personalizada. Cotiza gratis.',
      keywords: [
        'viajes a tu medida',
        'viajes personalizados Colombia',
        'paquetes personalizados',
        'viajes individuales',
        'viajes en pareja',
        'viajes en familia',
        'luna de miel Colombia',
        'viajes especiales',
        'cotización viajes',
        'asesoría turística'
      ],
      url: `${this.baseUrl}/viajes-a-tu-medida`,
      canonicalUrl: `${this.baseUrl}/viajes-a-tu-medida`
    });
  }

  /**
   * Actualiza meta tags para página de contacto
   */
  updateContactPageMeta(): void {
    this.updateMetaTags({
      title: 'Contacto - Santias Travel | Cotiza tu Viaje Gratis',
      description: 'Contacta a Santias Travel para planificar tu próximo viaje. WhatsApp: +57 304 267 2662. Email: informacion@santiastravel.cloud. Tuluá, Valle del Cauca, Colombia. Cotización gratuita.',
      keywords: [
        'contacto agencia viajes',
        'cotizar viaje Colombia',
        'WhatsApp agencia viajes',
        'Tuluá agencia viajes',
        'Valle del Cauca viajes',
        'asesoría de viajes',
        'consultoría turística',
        'reservar viaje'
      ],
      url: `${this.baseUrl}/contacto`,
      canonicalUrl: `${this.baseUrl}/contacto`
    });
  }

  /**
   * Actualiza meta tags para página sobre nosotros
   */
  updateAboutPageMeta(): void {
    this.updateMetaTags({
      title: 'Sobre Nosotros - Santias Travel | Agencia de Viajes en Tuluá',
      description: 'Conoce a Santias Travel, tu agencia de viajes de confianza en Tuluá, Valle del Cauca. Más de 3 años de experiencia creando experiencias de viaje inolvidables. +5000 viajes realizados.',
      keywords: [
        'sobre Santias Travel',
        'agencia viajes Tuluá',
        'historia agencia viajes',
        'equipo Santias Travel',
        'experiencia turística Colombia',
        'agencia viajes Valle del Cauca',
        'empresa turismo Colombia'
      ],
      url: `${this.baseUrl}/sobre-nosotros`,
      canonicalUrl: `${this.baseUrl}/sobre-nosotros`
    });
  }

  /**
   * Actualiza meta tags para página de términos y condiciones
   */
  updateTermsPageMeta(): void {
    this.updateMetaTags({
      title: 'Términos y Condiciones - Santias Travel',
      description: 'Términos y condiciones de servicio de Santias Travel. Información sobre reservaciones, pagos, cancelaciones y políticas de viaje.',
      keywords: [
        'términos y condiciones',
        'políticas de viaje',
        'condiciones servicio',
        'Santias Travel términos'
      ],
      url: `${this.baseUrl}/terminos`,
      canonicalUrl: `${this.baseUrl}/terminos`
    });
  }

  /**
   * Actualiza meta tags para página de política de privacidad
   */
  updatePrivacyPageMeta(): void {
    this.updateMetaTags({
      title: 'Política de Privacidad - Santias Travel',
      description: 'Política de privacidad de Santias Travel. Información sobre el tratamiento y protección de datos personales.',
      keywords: [
        'política de privacidad',
        'protección de datos',
        'privacidad Santias Travel',
        'tratamiento datos personales'
      ],
      url: `${this.baseUrl}/privacidad`,
      canonicalUrl: `${this.baseUrl}/privacidad`
    });
  }

  /**
   * Actualiza meta tags para página de detalle de viaje
   */
  updateTripDetailMeta(tripName: string, destination: string, description: string): void {
    this.updateMetaTags({
      title: `${tripName} - Santias Travel | Viaje a ${destination}`,
      description: description.substring(0, 160) + (description.length > 160 ? '...' : ''),
      keywords: [
        tripName,
        `viaje a ${destination}`,
        `tour ${destination}`,
        `paquete ${destination}`,
        'Santias Travel',
        'viajes Colombia'
      ],
      type: 'product'
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
      alternateName: 'Santías Travel',
      description: 'Agencia de viajes en Tuluá, Colombia. Especialistas en viajes grupales e individuales a destinos nacionales e internacionales.',
      url: this.baseUrl,
      logo: `${this.baseUrl}/faviconSantiasTravel.png`,
      image: `${this.baseUrl}/assets/images/og-image.jpg`,
      telephone: '+57 304 267 2662',
      email: 'informacion@santiastravel.cloud',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Carrera 34 # 26 - 61, Barrio Alvernia',
        addressLocality: 'Tuluá',
        addressRegion: 'Valle del Cauca',
        postalCode: '763021',
        addressCountry: 'CO'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 4.0847,
        longitude: -76.1985
      },
      sameAs: [
        'https://facebook.com/santiastravel',
        'https://instagram.com/santiastravel',
        'https://wa.me/573042672662'
      ],
      priceRange: '$$',
      currenciesAccepted: 'COP'
    };

    if (type === 'TravelAgency') {
      return JSON.stringify({
        ...baseData,
        '@type': 'TravelAgency',
        areaServed: [
          { '@type': 'Country', name: 'Colombia' },
          { '@type': 'AdministrativeArea', name: 'Valle del Cauca' }
        ],
        serviceType: ['Viajes Grupales', 'Viajes Individuales', 'Paquetes Turísticos', 'Tours Internacionales'],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '15',
          bestRating: '5',
          worstRating: '1'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Paquetes de Viaje',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Viajes a México',
                description: 'Paquetes turísticos a Ciudad de México, Cancún y más'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Viajes al Caribe',
                description: 'Paquetes a San Andrés, Santa Marta, República Dominicana'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'TouristTrip',
                name: 'Viajes Nacionales',
                description: 'Tours por Colombia: La Guajira, Cartagena, Eje Cafetero'
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
    if (isPlatformBrowser(this.platformId)) {
      // Remover structured data dinámico existente (mantener el del index.html)
      const existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Agregar nuevo structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic', 'true');
      script.text = data;
      document.head.appendChild(script);
    }
  }

  /**
   * Genera structured data para un viaje específico
   */
  generateTripStructuredData(trip: {
    name: string;
    description: string;
    destination: string;
    price?: number;
    image?: string;
    startDate?: string;
    endDate?: string;
  }): string {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: trip.name,
      description: trip.description,
      touristType: 'Vacacionista',
      provider: {
        '@type': 'TravelAgency',
        name: 'Santias Travel',
        url: this.baseUrl
      },
      itinerary: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: trip.destination
          }
        ]
      },
      ...(trip.price && {
        offers: {
          '@type': 'Offer',
          price: trip.price,
          priceCurrency: 'COP',
          availability: 'https://schema.org/InStock'
        }
      }),
      ...(trip.image && { image: trip.image }),
      ...(trip.startDate && { startDate: trip.startDate }),
      ...(trip.endDate && { endDate: trip.endDate })
    });
  }

  /**
   * Genera breadcrumb structured data
   */
  generateBreadcrumbData(items: { name: string; url: string }[]): string {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    });
  }
}

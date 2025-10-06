# Santias Travel - Frontend

Frontend de la agencia de viajes Santias Travel desarrollado con Angular 20.2 y SSR.

## 🚀 Características

- **Angular 20.2** con Standalone Components
- **Server-Side Rendering (SSR)** para mejor SEO
- **Arquitectura modular** siguiendo las mejores prácticas
- **Diseño responsive** optimizado para móviles
- **SCSS** con variables y mixins organizados
- **TypeScript** con tipado fuerte
- **Lazy Loading** para optimización de rendimiento

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                      # Funcionalidades centrales
│   │   ├── interfaces/            # Interfaces TypeScript
│   │   │   ├── destination.interface.ts
│   │   │   ├── testimonial.interface.ts
│   │   │   └── agency.interface.ts
│   │   └── services/              # Servicios principales
│   │       ├── api.service.ts     # Servicio base de API
│   │       ├── destination.service.ts
│   │       ├── testimonial.service.ts
│   │       └── agency.service.ts
│   │
│   ├── shared/                    # Componentes compartidos
│   │   └── components/
│   │       ├── header/            # Header de navegación
│   │       └── footer/            # Footer con newsletter
│   │
│   ├── layouts/                   # Layouts de la aplicación
│   │   └── components/
│   │       └── main-layout/       # Layout principal
│   │
│   ├── features/                  # Módulos por funcionalidad
│   │   ├── home/                  # Página principal
│   │   │   └── components/
│   │   │       ├── home/
│   │   │       ├── hero-section/
│   │   │       ├── about-section/
│   │   │       ├── experiences-section/
│   │   │       ├── testimonials-section/
│   │   │       └── newsletter-popup/
│   │   │
│   │   ├── destinations/          # Gestión de destinos
│   │   ├── custom-trips/          # Viajes personalizados
│   │   ├── about/                 # Página sobre nosotros
│   │   ├── contact/               # Página de contacto
│   │   └── legal/                 # Páginas legales
│   │
│   ├── app.routes.ts              # Configuración de rutas
│   ├── app.config.ts              # Configuración de la app
│   └── app.component.ts           # Componente raíz
│
├── assets/
│   ├── styles/                    # Estilos globales
│   │   ├── _variables.scss        # Variables SCSS
│   │   └── _mixins.scss           # Mixins reutilizables
│   ├── images/                    # Imágenes del proyecto
│   ├── icons/                     # Iconos
│   └── data/                      # Datos estáticos
│
├── environments/                  # Configuración por entorno
│   ├── environment.ts             # Desarrollo
│   └── environment.prod.ts        # Producción
│
└── styles.scss                    # Estilos globales principales
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Azul Primario**: `#1e40af` - Color principal de la marca
- **Naranja**: `#f97316` - Color de acento para CTAs
- **Teal**: `#14b8a6` - Color complementario

### Tipografía
- **Primaria**: Inter (textos generales)
- **Secundaria**: Poppins (títulos y elementos destacados)

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start                 # Ejecutar en modo desarrollo
npm run build            # Construir para producción
npm run watch            # Construir y vigilar cambios
npm test                 # Ejecutar pruebas unitarias

# SSR
npm run serve:ssr:santiasTravelFront  # Servir con SSR
```

## 📋 Funcionalidades Implementadas

### ✅ Completadas
- [x] Estructura modular del proyecto
- [x] Sistema de estilos con SCSS
- [x] Interfaces y modelos de datos
- [x] Servicios base para comunicación con API
- [x] Componentes compartidos (Header, Footer)
- [x] Layout principal
- [x] Sistema de rutas con lazy loading
- [x] Página principal (Home) con secciones:
  - [x] Hero section con imagen principal
  - [x] Sección "Sobre nosotros" con estadísticas
  - [x] Sección de experiencias/destinos
  - [x] Sección de testimonios
  - [x] Popup de newsletter
- [x] Componentes básicos para todas las rutas

### 🚧 En Desarrollo
- [ ] Implementación completa de páginas de destinos
- [ ] Formularios de contacto y cotización
- [ ] Integración completa con API del backend
- [ ] Optimizaciones de performance
- [ ] Implementación de analytics

## 🌐 API Integration

El frontend está preparado para conectarse con el backend de Spring Boot. Las configuraciones de URL se encuentran en:

- **Desarrollo**: `http://localhost:8080/api`
- **Producción**: `https://api.santiastravel.com/api`

## 📱 Características Especiales

### Responsive Design
- Diseño mobile-first
- Navegación adaptativa con menú hamburguesa
- Imágenes optimizadas para diferentes dispositivos

### SEO Optimizado
- Server-Side Rendering (SSR)
- Meta tags dinámicos
- Estructura semántica HTML5
- URLs amigables

### UX/UI Features
- Animaciones suaves con CSS
- Lazy loading de imágenes
- Estados de carga informativos
- Feedback visual en formularios
- Accesibilidad mejorada

### Integración WhatsApp
- Botón flotante de WhatsApp
- Mensajes predefinidos por contexto
- Integración en header y footer

## 🎯 Próximos Pasos

1. **Completar páginas faltantes**:
   - Lista detallada de destinos con filtros
   - Página de detalle de destino con galería
   - Formulario de viajes personalizados
   - Página completa de contacto

2. **Integración con Backend**:
   - Conexión real con API de Spring Boot
   - Manejo de estados de error
   - Cache de datos
   - Autenticación si es necesaria

3. **Optimizaciones**:
   - Implementar imágenes optimizadas
   - Configurar PWA si es necesario
   - Analytics y tracking
   - Tests unitarios y e2e

## 🚀 Deployment

El proyecto está configurado para deployment con SSR. Para producción:

1. Configurar variables de entorno en `environment.prod.ts`
2. Ejecutar `npm run build`
3. Servir con `npm run serve:ssr:santiasTravelFront`

## 🤝 Contribución

Este proyecto sigue las convenciones de Angular y mantiene un código limpio y bien documentado. Para contribuir:

1. Seguir la estructura modular establecida
2. Usar TypeScript con tipado fuerte
3. Mantener consistencia en estilos SCSS
4. Documentar componentes complejos
5. Seguir las convenciones de nomenclatura de Angular

---

**Desarrollado por**: Josué Londoño  
**Framework**: Angular 20.2  
**Última actualización**: Enero 2025
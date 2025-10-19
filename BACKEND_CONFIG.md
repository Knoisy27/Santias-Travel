# Configuración del Backend

## Cambiar URL del Backend

Para cambiar la URL del backend sin modificar código, puedes usar las siguientes opciones:

### Opción 1: Usar Configuraciones Predefinidas

#### Para Backend Local (puerto 9090):
```bash
npm run start:local
```

#### Para Backend de Desarrollo (puerto 8080):
```bash
npm run start
```

### Opción 2: Modificar Archivos de Entorno

#### Para Desarrollo Local:
Edita `src/environments/environment.dev.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9090/api', // Cambia aquí el puerto
  // ... resto de configuración
};
```

#### Para Producción:
Edita `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio.com/api', // Cambia aquí la URL de producción
  // ... resto de configuración
};
```

### Opción 3: Variables de Entorno (Recomendado para Despliegue)

Puedes usar variables de entorno creando un archivo `.env` en la raíz del proyecto:

```env
API_URL=http://localhost:9090/api
```

Y luego modificar `src/environments/environment.ts` para leer esta variable:

```typescript
export const environment = {
  production: false,
  apiUrl: process.env['API_URL'] || 'http://localhost:8080/api',
  // ... resto de configuración
};
```

## Scripts Disponibles

- `npm run start` - Desarrollo con backend en puerto 8080
- `npm run start:local` - Desarrollo con backend en puerto 9090
- `npm run build` - Build para producción
- `npm run build:local` - Build para desarrollo local

## Notas

- La configuración `dev-local` está configurada para usar el puerto 9090
- La configuración `development` usa el puerto 8080
- La configuración `production` usa la URL de producción

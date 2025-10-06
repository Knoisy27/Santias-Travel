# Angular Material en Santias Travel

## 🎨 Configuración

Angular Material ha sido configurado con un tema personalizado que usa los colores de nuestra marca:

### Colores del tema:
- **Primary**: `#3b82f6` (Azul principal)
- **Accent**: `#f97316` (Naranja de acento)
- **Warn**: Material Red (para errores)

### Tipografía:
- **Font Family**: Poppins (nuestra fuente principal)

## 📚 Cómo usar Material Components

### 1. Importar MaterialModule

En cualquier componente standalone:

```typescript
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  // ...
})
```

### 2. Componentes disponibles

#### Botones
```html
<!-- Botón primario -->
<button mat-raised-button color="primary">Botón Principal</button>

<!-- Botón con icono -->
<button mat-fab color="accent">
  <mat-icon>add</mat-icon>
</button>

<!-- Botón de texto -->
<button mat-button>Texto</button>
```

#### Formularios
```html
<mat-form-field appearance="outline">
  <mat-label>Campo</mat-label>
  <input matInput placeholder="Placeholder">
  <mat-icon matSuffix>search</mat-icon>
  <mat-error>Error message</mat-error>
</mat-form-field>

<mat-form-field appearance="outline">
  <mat-label>Select</mat-label>
  <mat-select>
    <mat-option value="option1">Opción 1</mat-option>
    <mat-option value="option2">Opción 2</mat-option>
  </mat-select>
</mat-form-field>
```

#### Cards
```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Título</mat-card-title>
    <mat-card-subtitle>Subtítulo</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    Contenido de la card
  </mat-card-content>
  <mat-card-actions>
    <button mat-button>ACCIÓN</button>
  </mat-card-actions>
</mat-card>
```

#### Diálogos
```typescript
// En el componente
constructor(public dialog: MatDialog) {}

openDialog() {
  const dialogRef = this.dialog.open(MiDialogoComponent, {
    width: '400px',
    data: { datos: 'para el diálogo' }
  });
}
```

#### Snackbars (Notificaciones)
```typescript
// En el componente
constructor(private snackBar: MatSnackBar) {}

mostrarNotificacion() {
  this.snackBar.open('Mensaje exitoso', 'Cerrar', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });
}
```

#### Progress Indicators
```html
<!-- Spinner circular -->
<mat-progress-spinner mode="indeterminate"></mat-progress-spinner>

<!-- Barra de progreso -->
<mat-progress-bar mode="determinate" [value]="40"></mat-progress-bar>
```

#### Iconos
```html
<!-- Iconos de Material Icons -->
<mat-icon>home</mat-icon>
<mat-icon>favorite</mat-icon>
<mat-icon>settings</mat-icon>

<!-- Con colores del tema -->
<mat-icon color="primary">star</mat-icon>
<mat-icon color="accent">favorite</mat-icon>
```

## 🎯 Ejemplos implementados

### Formulario de contacto
Ubicación: `src/app/features/contact/components/contact-form/`

Incluye:
- ✅ Form fields con validación
- ✅ Select dropdowns
- ✅ Date picker
- ✅ Botones con estados de loading
- ✅ Iconos integrados
- ✅ Cards para layout

## 📱 Responsive Design

Todos los componentes de Material están optimizados para móviles y se adaptan automáticamente. Los breakpoints coinciden con nuestro sistema:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Personalización adicional

Los componentes heredan automáticamente nuestros colores y tipografía, pero puedes personalizar individualmente:

```scss
.mi-boton-personalizado {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 24px;
}
```

## 📖 Documentación oficial

Para más componentes y opciones: [Angular Material Docs](https://material.angular.io/components/categories)

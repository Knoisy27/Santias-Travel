import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TripsService, ViajeGrupalCreateRequest, FileUploadResponse, UploadProgress } from '../../../../core/services/trips.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-viajes-grupales-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './viajes-grupales-form.component.html',
  styleUrl: './viajes-grupales-form.component.scss'
})
export class ViajesGrupalesFormComponent {
  private fb = inject(FormBuilder);
  private tripsService = inject(TripsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  viajeForm: FormGroup;
  isLoading = signal(false);
  isUploadingImage = signal(false);
  isUploadingVideo = signal(false);
  imageUploadProgress = signal(0);
  videoUploadProgress = signal(0);
  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;
  uploadedImageUrl = signal<string | null>(null);
  uploadedVideoUrl = signal<string | null>(null);

  constructor() {
    this.viajeForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]], // Sin maxLength
      valor: [0, [Validators.required, Validators.min(0)]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      incluye: ['', [Validators.required, Validators.minLength(10)]], // Sin maxLength
      itinerario: ['', [Validators.required, Validators.minLength(10)]], // Sin maxLength
      noIncluye: ['', [Validators.required, Validators.minLength(10)]], // Sin maxLength
      sugerencias: ['', [Validators.required, Validators.minLength(10)]] // Sin maxLength
    }, { validators: this.dateRangeValidator });
  }

  // Validador personalizado para fechas
  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const fechaInicio = control.get('fechaInicio')?.value;
    const fechaFin = control.get('fechaFin')?.value;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      if (inicio >= fin) {
        return { dateRange: true };
      }
    }

    return null;
  }

  // Getter para fecha mínima (hoy)
  get minDate(): Date {
    return new Date();
  }

  onSubmit(): void {
    if (this.viajeForm.valid) {
      this.isLoading.set(true);
      const user = this.authService.user();
      if (!user) {
        this.snackBar.open('Error: Usuario no autenticado.', 'Cerrar', { duration: 3000 });
        this.isLoading.set(false);
        return;
      }

      // Subir archivos primero si hay archivos seleccionados
      this.uploadFilesAndCreateViaje(user);
    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
    }
  }

  private uploadFilesAndCreateViaje(user: any): void {
    const uploadPromises: Promise<string | null>[] = [];

    // Subir imagen si hay una seleccionada
    if (this.selectedImageFile) {
      uploadPromises.push(this.uploadImagePromise(this.selectedImageFile));
    } else {
      uploadPromises.push(Promise.resolve(null));
    }

    // Subir video si hay uno seleccionado
    if (this.selectedVideoFile) {
      uploadPromises.push(this.uploadVideoPromise(this.selectedVideoFile));
    } else {
      uploadPromises.push(Promise.resolve(null));
    }

    // Esperar a que se suban todos los archivos
    Promise.all(uploadPromises).then(([imagenUrl, videoUrl]) => {
      this.createViajeGrupal(user, imagenUrl, videoUrl);
    }).catch((error) => {
      this.isLoading.set(false);
      this.snackBar.open('Error al subir archivos. Intenta nuevamente.', 'Cerrar', { duration: 5000 });
      console.error('Error subiendo archivos:', error);
    });
  }

  private uploadImagePromise(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.tripsService.uploadViajeGrupalImage(file).subscribe({
        next: (response: any) => resolve(response.url),
        error: (error: any) => reject(error)
      });
    });
  }

  private uploadVideoPromise(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.tripsService.uploadViajeGrupalImage(file).subscribe({
        next: (response: any) => resolve(response.url),
        error: (error: any) => reject(error)
      });
    });
  }

  private createViajeGrupal(user: any, imagenUrl: string | null, videoUrl: string | null): void {
    const formValue = this.viajeForm.value;
    const newViaje: ViajeGrupalCreateRequest = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      valor: formValue.valor,
      imagenUrl: imagenUrl || undefined,
      videoUrl: videoUrl || undefined,
      fechaInicio: formValue.fechaInicio,
      fechaFin: formValue.fechaFin,
      incluye: formValue.incluye,
      itinerario: formValue.itinerario,
      noIncluye: formValue.noIncluye,
      sugerencias: formValue.sugerencias,
      estado: 'A', // Estado por defecto: Activo
      modificadoPor: user.username,
    };

    console.log('Creando viaje grupal con datos:', newViaje);
    console.log('URLs de archivos - Imagen:', imagenUrl, 'Video:', videoUrl);

    this.tripsService.createViajeGrupal(newViaje).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.snackBar.open('Viaje grupal creado exitosamente!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin/viajes']);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error detallado al crear viaje grupal:', error);
        console.error('Status:', error.status);
        console.error('Error body:', error.error);
        console.error('Headers:', error.headers);
        
        let errorMessage = 'Error al crear el viaje grupal. Intenta nuevamente.';
        if (error.status === 400) {
          if (error.error && error.error.message) {
            errorMessage = `Error de validación: ${error.error.message}`;
          } else if (error.error && Array.isArray(error.error)) {
            errorMessage = `Errores de validación: ${error.error.join(', ')}`;
          } else {
            errorMessage = 'Datos inválidos. Por favor, revisa el formulario.';
          }
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción.';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o el backend.';
        }
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/viajes']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.viajeForm.controls).forEach(key => {
      const control = this.viajeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.viajeForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} no puede exceder ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${control.errors['min'].min}`;
      }
    }

    // Verificar errores del formulario completo (para validaciones cruzadas)
    if (this.viajeForm.errors && this.viajeForm.touched) {
      if (this.viajeForm.errors['dateRange']) {
        return 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      valor: 'Valor',
      fechaInicio: 'Fecha de Inicio',
      fechaFin: 'Fecha de Fin',
      incluye: 'Incluye',
      itinerario: 'Itinerario',
      noIncluye: 'No Incluye',
      sugerencias: 'Sugerencias'
    };
    return labels[fieldName] || fieldName;
  }

  // Métodos para manejo de archivos
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isValidImageType(file)) {
        this.selectedImageFile = file;
        // Solo mostrar preview, no subir aún
        this.showImagePreview(file);
      } else {
        this.snackBar.open(
          'Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.',
          'Cerrar',
          { duration: 5000 }
        );
        // Limpiar el input
        event.target.value = '';
      }
    }
  }

  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isValidVideoType(file)) {
        this.selectedVideoFile = file;
        // Solo mostrar preview, no subir aún
        this.showVideoPreview(file);
      } else {
        this.snackBar.open(
          'Tipo de archivo no válido. Solo se permiten MP4 y WebM.',
          'Cerrar',
          { duration: 5000 }
        );
        // Limpiar el input
        event.target.value = '';
      }
    }
  }

  private uploadImage(file: File): void {
    this.isUploadingImage.set(true);
    this.imageUploadProgress.set(0);


    this.tripsService.uploadViajeGrupalImageWithProgress(file).subscribe({
      next: (response) => {
        if ('percentage' in response) {
          // Es un evento de progreso
          this.imageUploadProgress.set(response.percentage);
        } else {
          // Es la respuesta final
          this.uploadedImageUrl.set(response.url);
          this.isUploadingImage.set(false);
          this.snackBar.open('Imagen subida exitosamente', 'Cerrar', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isUploadingImage.set(false);
        console.error('Error subiendo imagen:', error);
        
        let errorMessage = 'Error al subir la imagen. Intenta nuevamente.';
        if (error.status === 400) {
          errorMessage = 'Archivo inválido. Solo se permiten imágenes JPG, PNG y WebP.';
        } else if (error.status === 413) {
          errorMessage = 'El archivo es demasiado grande. Máximo 50MB.';
        }
        
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  private uploadVideo(file: File): void {
    this.isUploadingVideo.set(true);
    this.videoUploadProgress.set(0);

    // Para videos, usamos el mismo endpoint pero con validación diferente
    const formData = new FormData();
    formData.append('file', file);
    
    this.tripsService.uploadViajeGrupalImage(file).subscribe({
      next: (response) => {
        this.uploadedVideoUrl.set(response.url);
        this.isUploadingVideo.set(false);
        this.snackBar.open('Video subido exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.isUploadingVideo.set(false);
        console.error('Error subiendo video:', error);
        
        let errorMessage = 'Error al subir el video. Intenta nuevamente.';
        if (error.status === 400) {
          errorMessage = 'Archivo inválido. Solo se permiten videos MP4 y WebM.';
        } else if (error.status === 413) {
          errorMessage = 'El archivo es demasiado grande. Máximo 50MB.';
        }
        
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.uploadedImageUrl.set(null);
    this.imageUploadProgress.set(0);
  }

  removeVideo(): void {
    this.selectedVideoFile = null;
    this.uploadedVideoUrl.set(null);
    this.videoUploadProgress.set(0);
  }

  // Métodos para mostrar previews
  private showImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadedImageUrl.set(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  private showVideoPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadedVideoUrl.set(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Métodos de validación de tipos de archivo
  private isValidImageType(file: File): boolean {
    const validImageTypes = [
      'image/jpeg',
      'image/png', 
      'image/webp'
    ];
    return validImageTypes.includes(file.type);
  }

  private isValidVideoType(file: File): boolean {
    const validVideoTypes = [
      'video/mp4',
      'video/webm'
    ];
    return validVideoTypes.includes(file.type);
  }
}

import {
  Component, // Importa el decorador Component para definir un componente
  Input, // Decorador para recibir propiedades desde el padre
  OnChanges, // Interfaz para detectar cambios en @Input
  OnDestroy, // Interfaz para manejar la destrucción del componente
  OnInit, // Interfaz para inicialización del componente
  SimpleChanges, // Tipo que describe los cambios en @Input
} from '@angular/core';

export type carouselImages =  { // Define un tipo para un arreglo de objetos de imagen del carrusel
    src: string; // URL de la imagen
    loaded: boolean; // Indica si la imagen ya se cargó
    loading: boolean; // Indica si la imagen está en proceso de carga 
    alt: string; // Texto alternativo
  }[] // Arreglo de las imágenes
  
@Component({
  selector: 'app-carousel', // Selector del componente para usarlo en templates
  standalone: true, // Componente standalone (no requiere NgModule)
  imports: [], // No importa módulos adicionales aquí (el template puede usar directivas nativas)
  templateUrl: './carousel.component.html', // Ruta del archivo de template HTML
  styleUrl: './carousel.component.css', // Ruta del archivo de estilos
})
export class CarouselComponent implements OnInit, OnChanges, OnDestroy { // Clase del componente que implementa ciclos de vida
  @Input() images: carouselImages = [ // Entrada con las imágenes del carrusel y valor por defecto
  ];

  @Input() autoPlay: boolean = true; // Si es true, el carrusel avanza automáticamente
  @Input() showIndicators: boolean = true; // Si es true, muestra indicadores (no usados aquí pero disponible)
  @Input() showControls: boolean = true; // Si es true, muestra controles anterior/siguiente
  @Input() interval: number = 7000; // Intervalo en ms para el autoPlay

  currentIndex = 0; // Índice de la imagen actualmente visible
  private isDestroyed: boolean = false; // Flag para saber si el componente fue destruido
  private autoPlayInterval?: number; // ID del intervalo del autoPlay para poder limpiarlo

  ngOnInit(): void { // Hook que se ejecuta al inicializar el componente
    this.loadImage(0); // Pre-carga la primera imagen
    if (this.autoPlay) { // Si autoPlay está activo
      this.startAutoPlay(); // Inicia el avance automático
    }
  }

  ngOnChanges(changes: SimpleChanges): void { // Hook que se ejecuta cuando cambian las @Input
    console.log('cambios en la configuracion del carousel', changes); // Log de cambios para depuración
    
    if (changes['images'] && !changes['images'].firstChange) { // Si cambió la lista de imágenes y no es el primer cambio
      this.currentIndex = 0; // Reinicia el índice actual
      this.resetLoadedStates(); // Resetea estados de carga/cargado
      this.loadImage(this.currentIndex); // Carga la imagen en el índice actual
    }
    
    if (changes['autoPlay'] && !changes['autoPlay'].firstChange) {  // Si cambió autoPlay después de la primera vez
      if (changes['autoPlay'].currentValue) { // Si ahora está activo
        this.startAutoPlay(); // Inicia el autoPlay
      } else {
        this.stopAutoPlay(); // Detiene el autoPlay
      }
    }
    
    if (changes['interval'] && !changes['interval'].firstChange && this.autoPlay) { // Si cambió el intervalo y autoPlay está activo
      this.stopAutoPlay(); // Detiene el intervalo actual
      this.startAutoPlay(); // Inicia uno nuevo con el nuevo intervalo
    }
  }
  ngOnDestroy(): void { // Hook que se ejecuta antes de destruir el componente
    console.log('Componente destruido') // Log de destrucción
    this.isDestroyed = true; // Marca el componente como destruido
    this.stopAutoPlay(); // Limpia el intervalo del autoPlay si existe
    this.cancelPendingImagesLoads() // Cancela estados de carga pendientes
  }

  loadImage(index: number) { // Método para iniciar la carga de una imagen por índice
    if (index < 0 || index >= this.images.length) { // Si el índice está fuera de rango
      return; // No hace nada
    }
    if (this.images[index].loaded) { // Si la imagen ya está cargada 
      return; // Evita recargarla
    }
    this.images[index].loading = true; // Marca la imagen como en carga
    const img = new Image(); // Crea un objeto Image para cargar en segundo plano
    img.onload = () => { // Callback cuando la imagen termina de cargar
      console.log(`Imagen ${index + 1} cargada exitosamente`); // Log de éxito
      setTimeout(() => { // Pequeño retraso para suavizar la transición/estado
        this.images[index].loaded = true; // Marca la imagen como cargada
        this.images[index].loading = false; // Quita el estado de cargando
      }, 1000); // 1 segundo de delay
    };
    img.src = this.images[index].src; // Asigna la URL de la imagen para iniciar su carga
  }
  private startAutoPlay() { // Inicia el intervalo para avanzar automáticamente
    if (this.autoPlay && !this.isDestroyed) { // Solo si autoPlay está activo y el componente no está destruido
      this.autoPlayInterval = window.setInterval(() => { // Crea un intervalo con window.setInterval
        console.log(this.currentIndex) // Log del índice actual (depuración)
        this.nextImage(); // Avanza a la siguiente imagen
      }, this.interval); // Cada 'interval' milisegundos
    }
  }

  private stopAutoPlay() { // Detiene el autoPlay si está activo
    if (this.autoPlayInterval) { // Si hay un intervalo corriendo
      clearInterval(this.autoPlayInterval); // Limpia el intervalo
      this.autoPlayInterval = undefined; // Restablece el identificador
    }
  }

  nextImage() { // Avanza a la siguiente imagen
    this.currentIndex = (this.currentIndex + 1) % this.images.length; // Incrementa el índice con retorno al inicio
    this.loadImage(this.currentIndex); // Asegura que la imagen actual esté cargada

    const nextIndex = (this.currentIndex + 1) % this.images.length; // Calcula el índice de la siguiente imagen (prefetch)
    this.loadImage(nextIndex); // Pre-carga la siguiente para transiciones suaves
  }
  prevImage() { // Retrocede a la imagen anterior
    this.currentIndex =
      this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1; // Decrementa con retorno al final
    this.loadImage(this.currentIndex); // Asegura la carga de la imagen actual

    const prevIndex =
      this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1; // Calcula el índice previo (prefetch)
    this.loadImage(prevIndex); // Pre-carga la anterior para transiciones suaves
  }

  private resetLoadedStates() { // Resetea estados de carga y cargado de todas las imágenes
    this.images.forEach((image) => { // Itera sobre las imágenes
      image.loaded = false; // Marca como no cargada
      image.loading = false; // Marca como no cargando
    });
  }
  private cancelPendingImagesLoads() { // Cancela cargas en progreso (estado visual)
    this.images.forEach((image) => { // Itera sobre las imágenes
      image.loading = false; // Quita la marca de cargando
    });
  }

}

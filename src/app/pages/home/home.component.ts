import { Component, OnInit } from '@angular/core'; 
// Importa el decorador @Component para definir un componente Angular.

import { CarouselComponent } from "../../components/carousel/carousel.component";  
// Importa el componente de carrusel que se usará dentro del template (home.component.html).

import { map, Observable } from 'rxjs'; 
import { ProductsService } from '../../core/services/products/products.service';
// 'map' es un operador de RxJS para transformar los valores emitidos por un Observable.
// 'Observable' se usa para manejar flujos de datos asíncronos.
import { Product } from '../../core/types/Products';
 
type CarouselImage = {
  src: string;
  loaded: boolean;
  loading: boolean;
  alt: string;
};

@Component({
  selector: 'app-home', // Selector para usar el componente en HTML: <app-home>
  standalone: true, // Define que este componente no necesita estar en un NgModule.
  imports: [CarouselComponent], // Importa el componente de carrusel para usarlo dentro del template.
  templateUrl: './home.component.html', // Ruta al archivo HTML asociado al componente.
  styleUrl: './home.component.css' // Ruta al archivo de estilos del componente.
})
export class HomeComponent implements OnInit{ 
  // Clase principal del componente Home, que se muestra en la página de inicio.

  indicators: boolean = false; 
  // Variable que controla si se muestran los indicadores del carrusel (puntos o flechas).
  autoPlay: boolean = true; 
  // Variable que indica si el carrusel debe avanzar automáticamente.
  title: string = ''; 
  // Texto que se mostrará en la interfaz, actualizará cada 2 segundos con la fecha actual.
  

  images: CarouselImage[] = [];


  constructor(private productService: ProductsService) {
    // El constructor se ejecuta cuando se crea la instancia del componente.

    this.title$.pipe( // Se conecta (suscribe) al Observable 'title$' para escuchar sus emisiones.
      map(data => { // 'map' transforma el valor emitido (que es un objeto Date)
        return data.toDateString(); // Convierte la fecha a un string legible (ej: "Wed Oct 16 2025")
      })
    ).subscribe(this.setTitle); 
    // Se suscribe al flujo. Cada vez que 'title$' emite una fecha nueva, se ejecuta 'setTitle()'.
    // *Nota:* Aquí 'setTitle' no recibe directamente la fecha (por cómo está escrito), 
    // pero se ejecuta periódicamente para actualizar el título.
  }

  private setTitle = () => {
    // Función privada que actualiza la propiedad 'title' con la fecha actual.
    const date = new Date(); // Obtiene la fecha y hora actual.
    this.title = `(${date})`; // Actualiza el título con la fecha entre paréntesis.
  }

  title$ = new Observable<Date>((observer) => {
    // Crea un Observable manualmente, que emite un nuevo valor cada 2 segundos.
    setInterval(() => {
      observer.next(new Date()); // Emite la fecha y hora actual al suscriptor.
    }, 2000);
  });
  // Cada 2 segundos, este Observable emite una nueva instancia de Date.
  // El 'subscribe' en el constructor escucha estas emisiones para actualizar el título.

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      // si getProducts() devuelve ProductResponse { products: Product[] }
      const products: Product[] = (res as any).products ?? res;

      const cheapest10 = [...products]
        .sort((a, b) => a.price - b.price)
        .slice(0, 10);

      this.images = cheapest10.map(p => ({
        src: p.imageUrl?.[0] ?? 'https://placehold.co/100x100.png',
        loaded: false,
        loading: false,
        alt: p.name ?? ''
      }));
    });
  }
}

/* Explicación detallada

🌀 Observable (title$)

title$ es un Observable personalizado que emite una nueva fecha (new Date()) cada 2 segundos.
Angular no lo ejecuta automáticamente; lo hace cuando alguien se suscribe, como en el constructor.
Se usa el operador map para transformar cada Date en un string legible (por ejemplo, "Fri Oct 17 2025").

⚙️ pipe y map

.pipe(map(...)) sirve para transformar los valores antes de que lleguen al suscriptor.
En este caso, el valor emitido (Date) se convierte en texto con toDateString().

🧩 subscribe(this.setTitle)

La suscripción activa el Observable.
Cada vez que title$ emite algo, se ejecuta setTitle(), que cambia el valor de title.
Esto podría usarse, por ejemplo, para mostrar la fecha actual en tiempo real en el HTML.

🎛️ indicators y autoPlay

Son flags (banderas booleanas) que controlan el comportamiento del carrusel:
indicators: muestra/oculta los indicadores visuales del carrusel.
autoPlay: activa o detiene la rotación automática. */
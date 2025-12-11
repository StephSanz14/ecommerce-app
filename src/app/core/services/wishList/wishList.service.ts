import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { WishList, wishListSchema } from '../../types/WishList';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = `${environment.BACK_URL}/wishlist`;

  private wishlistSubject = new BehaviorSubject<WishList | null>(null);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {
    // Cargar wishlist al crear el servicio (si el usuario está logueado
    // y el token es válido, authMiddleware en el backend lo identificará)
    this.loadWishlist();
  }

  // =========================
  //   Cargar wishlist actual
  // =========================
  loadWishlist(): void {
    this.http.get(`${this.baseUrl}`).pipe(
      map((data: any) => {
        // Tu controlador aparentemente responde algo como { wishList: ... }
        const parsed = wishListSchema.safeParse(data.wishList);
        if (!parsed.success) {
          console.log('Error validando wishlist:', parsed.error);
          return null;
        }
        return parsed.data;
      }),
      catchError(err => {
        console.error('Error al cargar wishlist:', err);
        return of(null);
      })
    ).subscribe((wishList) => {
      this.wishlistSubject.next(wishList);
    });
  }

  // =========================
  //   Agregar producto
  // =========================
  addToWishlist(productId: string): Observable<WishList | null> {
    return this.http
      .post(`${this.baseUrl}/add`, { productId }) // POST /api/wishlist/add
      .pipe(
        switchMap(() => this.http.get(`${this.baseUrl}`)),   // GET /api/wishlist
        map((data: any) => {
          const parsed = wishListSchema.safeParse(data.wishList);
          return parsed.success ? parsed.data : null;
        }),
        tap((updated) => {
          if (updated) {
            this.toast.success('Producto agregado a la lista de deseos');
            this.wishlistSubject.next(updated);
          }
        }),
        catchError((err) => {
          console.error('Error al agregar a wishlist:', err);
          return of(null);
        })
      );
  }

  // =========================
  //   Eliminar producto
  // =========================
  removeFromWishlist(productId: string): Observable<WishList | null> {
    return this.http
      .delete(`${this.baseUrl}/remove/${productId}`) // DELETE /api/wishlist/remove/:productId
      .pipe(
        switchMap(() => this.http.get(`${this.baseUrl}`)),   // GET /api/wishlist
        map((data: any) => {
          const parsed = wishListSchema.safeParse(data.wishList);
          return parsed.success ? parsed.data : null;
        }),
        tap((updated) => {
          if (updated) {
            this.toast.success('Producto eliminado de la lista de deseos');
            this.wishlistSubject.next(updated);
          }
        }),
        catchError((err) => {
          console.error('Error al eliminar de wishlist:', err);
          return of(null);
        })
      );
  }

  // =========================
  //   Vaciar wishlist
  // =========================
  clearWishlist(): Observable<WishList | null> {
    return this.http
      .delete(`${this.baseUrl}/clear`) // DELETE /api/wishlist/clear
      .pipe(
        tap(() => {
          this.wishlistSubject.next(null);
          this.toast.success('Lista de deseos vaciada');
        }),
        map(() => null),
        catchError((err) => {
          console.error('Error al vaciar wishlist:', err);
          return of(null);
        })
      );
  }

  // =========================
  //   Verificar producto
  // =========================
  isInWishlist(productId: string): Observable<boolean> {
    return this.http
      .get(`${this.baseUrl}/check/${productId}`) // GET /api/wishlist/check/:productId
      .pipe(
        map((data: any) => data.inWishList ?? false),
        catchError((err) => {
          console.error('Error al verificar wishlist:', err);
          return of(false);
        })
      );
  }

  // =========================
  //   Contador de productos
  // =========================
  getItemCount(): Observable<number> {
    return this.wishlist$.pipe(
      map((wl) => wl?.products.length ?? 0)
    );
  }
}

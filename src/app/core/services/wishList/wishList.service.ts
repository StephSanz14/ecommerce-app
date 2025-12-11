import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { WishList, wishListSchema } from '../../types/WishList';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
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
    private toast: ToastService,
    private store: Store
  ) {
    this.loadWishlist();
  }

  private getUserId(): string {
    let userId = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe((id) => (userId = id ?? ''));
    return userId;
  }

  // Obtener wishlist del usuario
  loadWishlist() {
    const userId = this.getUserId();
    if (!userId) {
      this.wishlistSubject.next(null);
      return;
    }

this.http.get(`${this.baseUrl}`).subscribe({
      next: (data: any) => {
        const parsed = wishListSchema.safeParse(data.wishList);
        if (!parsed.success) {
          console.log(parsed.error);
          this.wishlistSubject.next(null);
          return;
        }
        this.wishlistSubject.next(parsed.data);
      },
      error: () => this.wishlistSubject.next(null),
    });
  }

  // Agregar a wishlist
  addToWishlist(productId: string): Observable<WishList | null> {
    const userId = this.getUserId();
    if (!userId) {
      return of(null);
    } 
    return this.http
    .post(`${this.baseUrl}/${userId}/add`, { productId }) 
      .pipe(
        switchMap(() => this.http.get(`${this.baseUrl}`)),
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
        catchError(() => of(null))
      );
  }

  // Eliminar producto
  removeFromWishlist(productId: string): Observable<WishList | null> {
    return this.http
    .delete(`${this.baseUrl}/remove/${productId}`)
      .pipe(
switchMap(() => this.http.get(`${this.baseUrl}`)),
        map((data: any) => {
          const parsed = wishListSchema.safeParse(data.wishList);
          return parsed.success ? parsed.data : null;
        }),
        tap((updated) => {
          if (updated) {
            this.toast.success('Producto eliminado de la lista de deseos');
            this.wishlistSubject.next(updated);
          }
        })
      );
  }

  clearWishlist(): Observable<WishList | null> {
    return this.http.delete(`${this.baseUrl}/clear`).pipe(
      tap(() => {
        this.wishlistSubject.next(null);
        this.toast.success('Lista de deseos vaciada');
      }),
      map(() => null)
    );
  }

  // Verifica si un producto está en la wishlist
  isInWishlist(productId: string): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/check/${productId}`).pipe(
      map((data: any) => data.inWishList ?? false),
      catchError(() => of(false))
    );
  }
}
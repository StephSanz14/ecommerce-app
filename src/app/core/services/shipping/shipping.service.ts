import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment.development';
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
import { selectUserId } from '../../store/auth/auth.selectors';
import { ShippingAddress, ShippingAddressArraySchema } from '../../types/ShippingAdress';

@Injectable({
  providedIn: 'root'
})
export class ShippingAddressService {
  private baseUrl = `${environment.BACK_URL}/shipping-address`;
  private shippingAddressSubject = new BehaviorSubject<ShippingAddress | null>(null);
  private shippingAddressListSubject = new BehaviorSubject<ShippingAddress[]>([]);
  shippingAddress$ = this.shippingAddressSubject.asObservable();
  shippingAddresses$ = this.shippingAddressListSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private store: Store,
  ) { 
    this.loadShippingAddresses();
  }

  getUserId() {
    let id = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe((userId) => (id = userId ?? ''));
    return id;
  }

  loadShippingAddresses() { 
    const id = this.getUserId();
    console.log('Loading shipping addresses for user ID:', id);

    if (!id) {
      console.log('No user ID found, setting empty array');
      this.shippingAddressListSubject.next([]);
      return;
    }

    // 🔹 AQUÍ SOLO LLAMAMOS A GET /
    this.getShippingAddresses().subscribe({
      next: (data) => {
        console.log('Shipping addresses loaded:', data);
        this.shippingAddressListSubject.next(data);
      },
      error: (error) => {
        console.log('Error loading shipping addresses:', error);
      },
    });
  }

  // 🔹 COINCIDE CON router.get('/', authMiddleware, getUserAddresses);
  getShippingAddresses(): Observable<ShippingAddress[]> {
  return this.http.get(this.baseUrl).pipe(
    map((data: any) => {
      // 👇 Intentamos detectar dónde viene el array
      const rawArray =
        Array.isArray(data)
          ? data
          : data.addresses ?? data.data ?? [];

      const response = ShippingAddressArraySchema.safeParse(rawArray);

      if (!response.success) {
        console.log(response.error);
        return [];
      }

      return response.data;
    })
  );
}

  // 🔹 COINCIDE CON router.post('/', addressValidations, validate, authMiddleware, createShippingAddress);
  AddShippingAddress(address: ShippingAddress): Observable<ShippingAddress[]> {
    const id = this.getUserId();
    if (!id) {
      return of([]);
    }

    // el backend obtiene el user del token, pero no estorba mandarlo
    const data = { ...address, user: id };

    return this.http.post(this.baseUrl, data).pipe(
      switchMap(() => this.getShippingAddresses()),
      tap((updatedAddress) => {
        this.toast.success('Dirección de envío agregada');
        this.shippingAddressListSubject.next(updatedAddress);
      })
    );
  }

  // 🔹 COINCIDE CON router.put('/:addressId', ...);
  editShippingAddress(address: ShippingAddress) {
    const id = this.getUserId();
    if (!id || !address._id) {
      return of([]);
    }

    return this.http.put(`${this.baseUrl}/${address._id}`, address).pipe(
      switchMap(() => this.getShippingAddresses()),
      tap((updatedAddress) => {
        this.toast.success('Dirección de envío actualizada');
        this.shippingAddressListSubject.next(updatedAddress);
      })
    );
  }

  // 🔹 COINCIDE CON router.delete('/:addressId', ...);
  deleteShippingAddress(id: string) {
    const userId = this.getUserId();
    if (!userId) {
      return of([]);
    }

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      switchMap(() => this.getShippingAddresses()),
      tap((updatedAddress) => {
        this.toast.success('Dirección de envío eliminada');
        this.shippingAddressListSubject.next(updatedAddress ?? []);
      }),
      catchError(error => {
        console.error('Error deleting shipping address:', error);
        this.shippingAddressListSubject.next([]);
        return of([]);
      })
    );
  }
}

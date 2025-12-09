import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, orderArraySchema, orderSchema } from '../../types/Order';
import { AuthService } from '../auth/auth.service';
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
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.BACK_URL}/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public $order = this.ordersSubject.asObservable();

  private lastOrderSubject = new BehaviorSubject<Order | null>(null);
  public lastOrder$ = this.lastOrderSubject.asObservable();
  constructor(private http: HttpClient, private store: Store) {}

  private getUserId(): string {
    let id = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe({ next: (userId) => (id = userId ?? '') });
    return id;
  }

  loadOrders(): void {
    const userId = this.getUserId();
    if (!userId) return;
  }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get(`${this.baseUrl}/${userId}`).pipe(
      map((data) => {
        console.log(data);
        const response = orderArraySchema.safeParse(data);
        if (!response.success) {
          throw new Error(`Order validation failed: ${response.error}`);
        }
        return response.data;
      }),
      catchError((error) => {
        if (error.status === 404) {
          return of([]);
        }
        console.log('Error fetching order', error);
        return of([]);
      })
    );
  }

  createOrder(order: Order): Observable<Order[]> {
    return this.http.post(`${this.baseUrl}`, order).pipe(
      map((newOrder) => {
        const reponse = orderSchema.safeParse(newOrder);
        if (!reponse.success) {
          console.log(reponse.error);
          return [];
        }
        this.lastOrderSubject.next(reponse.data);
        return [...(this.ordersSubject.value ?? []), reponse.data];
      }),
      tap((updatedOrders) => {
        this.ordersSubject.next(updatedOrders);
      })
    );
  }
}
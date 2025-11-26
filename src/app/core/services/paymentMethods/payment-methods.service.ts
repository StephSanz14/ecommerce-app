import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import {
  CreatePaymentMethod,
  PaymentMethod,
  PaymentMethodArraySchema,
  UpdatePaymentMethod,
} from '../../types/PaymentMethod';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService {
  private baseUrl = `${environment.BACK_URL}/payment-methods`;
  private paymentSubject = new BehaviorSubject<PaymentMethod[]>([]);
  private readonly payments$ = this.paymentSubject.asObservable();

  constructor(private http: HttpClient, private store: Store) {}
  getUserId(): string {
    let userId = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe({ next: (id) => (userId = id ?? '') });
    return userId;
  }

  getPaymentMethodsByUser(userId: string): Observable<PaymentMethod[]> {
    return this.http.get(`${this.baseUrl}/user/${userId}`).pipe(
      map((data) => {
        const response = PaymentMethodArraySchema.safeParse(data);
        if (!response.success) {
          console.log(response.error);
          return [];
        }
        return response.data;
      })
    );
  }

  createPaymentMethod(data: CreatePaymentMethod): Observable<PaymentMethod[]> {
    const user = this.getUserId();
    const payload = {
      user,
      ...data,
    };
    return this.http.post(this.baseUrl, payload).pipe(
      switchMap(
        () => this.getPaymentMethodsByUser(user)),
        tap((updatedData) => {
          this.paymentSubject.next(updatedData);
        })
      
    );
  }

  // 1,3,4,5,6,7,8,9,0
  updatePaymentMethod(
    updatedPaymentmethodData: UpdatePaymentMethod
  ): Observable<PaymentMethod[]> {
    const userId = this.getUserId();
    return this.http
      .put(
        `${this.baseUrl}/${updatedPaymentmethodData._id}`,
        updatedPaymentmethodData
      )
      .pipe(
        switchMap(() => this.getPaymentMethodsByUser(userId)),
        tap((updatedData) => {
          this.paymentSubject.next(updatedData);
        })
      );
  }
}

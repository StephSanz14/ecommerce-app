import { Component, computed, OnInit, signal } from '@angular/core';
import { Cart } from '../../../core/types/Cart';
import { Observable, of, take } from 'rxjs';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { ofType } from '@ngrx/effects';
import { PaymentService } from '../../../core/services/paymentMethods/payment-methods.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Store } from '@ngrx/store';
import { Order } from '../../../core/types/Order';
import { OrderService } from '../../../core/services/order/order.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { selectUserId } from '../../../core/store/auth/auth.selectors';
import { ShippingAddressComponent } from '../shipping-address/shippingAddress.component';
import { PaymentMethodsListComponent } from "../../../components/payment/payment-methods-list/payment-methods-list.component";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    CommonModule,             // para @if, @for, etc.
    PaymentMethodsListComponent,
    CurrencyPipe,             // para | currency
    AsyncPipe,                 // para | async
    RouterLink
  ],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent implements OnInit{
  cartSignal = signal<Cart|null>(null);
  Loading = signal(false);
  errorMsg = signal<string|null>(null);

  paymenthMethods$ : Observable<PaymentMethod[]> = of([]);
  paymenthMethodId: string = '';

  total = computed(
    ()=>
      this.cartSignal()?.products.reduce(
        (acc, p) => acc+p.product.price*p.quantity,
        0
      )||0
    );

    constructor(
      private paymentService:PaymentService,
      private cartService:CartService,
      private store:Store,
      private orderservice:OrderService,
      private router: Router,
      private toast:ToastService,
    ){}


  ngOnInit(): void {
    const userId = this.getUserId();
    if (!userId) {
      return;
    }
    this.cartService.cart$.subscribe(cart=>this.cartSignal.set(cart));
    this.paymentService.loadPayMethods();

    this.paymenthMethods$ = this.paymenthMethods$;
  }

  onPaymenthMethodSelected(id:string){
    this.paymenthMethodId=id;
  }

  submitOrder(){ 
    const cart = this.cartSignal();
    const user = this.getUserId();

    if (!cart||!user) {
      return;
    }
    this.Loading.set(true);

    const orderPayLoad={
      user,
      products: cart.products.map(p=>({productId:p.product._id, quantity:p.quantity, price:p.product.price})),
      totalPrice: this.total(), 
      status:'pending',
      shippingAdress:'689a09119550ee3e8602145d',
      paymentMethod: this.paymenthMethodId,
      shippingCost: 0,
    } as unknown as Order;

    this.orderservice.createOrder(orderPayLoad).subscribe({
      next:()=>{
        this.cartService.clearCart().subscribe(()=>{
          this.cartSignal.set(null);
          this.Loading.set(false);
          this.router.navigateByUrl('/thank-you-page');
        })
      },
      error:(error)=>{
        this.Loading.set(false);
        console.log(error);
        this.errorMsg.set('No se pudo generar la compra');
      }
    })
  }

  getUserId(){
    let id = '';
    this.store.select(selectUserId).pipe(take(1)).subscribe(userId=> id = userId ?? '');
    return id;
  }
}

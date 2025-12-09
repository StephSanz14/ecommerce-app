import { Routes } from '@angular/router';
import { userResolver } from '../../core/resolvers/user/user.resolver';
import { authGuard } from '../../core/guards/auth/auth.guard';
import { CheckOutComponent } from './check-out/check-out.component';

export const USER_ROUTES: Routes = [
  {
    path: 'paymentmethods',
    loadComponent: () =>
      import('./paymethods/paymethods.component').then(
        (c) => c.PaymethodsComponent
      ),
    title: 'Metodos de pago',
  },
  {
    path: 'shipping_address',
    loadComponent: () =>
      import('./shipping-address/shippingAddress.component').then(
        (c) => c.ShippingAddressComponent
      ),
    title: 'Direcciones de envio',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then((c) => c.CartComponent),
    title: 'Carrito',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((c) => c.ProfileComponent),
    title: 'Mi perfil',
    resolve: {
      user: userResolver,
    },
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wish-list/wish-list.component').then(
        (c) => c.WishListComponent
      ),
    title: 'Lista de deseos',
  },
  {
    path: 'checkout',
    loadComponent:() =>
    import('./check-out/check-out.component').then(
      (c)=> c.CheckOutComponent
    ),
    title: 'Checkout',
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  
];

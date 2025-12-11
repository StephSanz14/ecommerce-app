import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WishList } from '../../../core/types/WishList';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../core/services/wishList/wishList.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastService } from '../../../core/services/toast/toast.service';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css',
})
export class WishListComponent implements OnInit {
  wishlist$: Observable<WishList | null> = of(null);

  constructor(private wishlistService: WishlistService, private cartService: CartService, private toast:ToastService) {}

  ngOnInit(): void {
    this.wishlist$ = this.wishlistService.wishlist$;
  }

  remove(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe();
  }

  clear() {
    this.wishlistService.clearWishlist().subscribe();
  }

   addToCart(productId: string) {
    if (!productId) return;

    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.toast.success('Producto agregado al carrito');
        this.wishlistService.removeFromWishlist(productId).subscribe();
      },
      error: (err) => {
        console.error('Error al agregar al carrito desde wishlist', err);
        this.toast.error('No se pudo agregar al carrito');
      }
    });
  }
}
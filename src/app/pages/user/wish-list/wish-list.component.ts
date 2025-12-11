import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WishList } from '../../../core/types/WishList';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../core/services/wishList/wishList.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css',
})
export class WishListComponent implements OnInit {
  wishlist$: Observable<WishList | null> = of(null);

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlist$ = this.wishlistService.wishlist$;
  }

  remove(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe();
  }

  clear() {
    this.wishlistService.clearWishlist().subscribe();
  }
}
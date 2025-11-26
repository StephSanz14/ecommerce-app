import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/types/Products';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{
  product: Product | null = null;
  loading = false; 

  constructor(private productService: ProductsService, private route: ActivatedRoute, private cartService: CartService){}

  ngOnInit(): void { 
    this.route.paramMap.subscribe({
      next:(params)=>{
        console.log(params)
        const id = params.get('id');
        if (!id) {
          return
        }
        this.productService.getProductByID(id).subscribe({
          next:(product)=>{
            this.product = product;
            console.log(product)
          },
          error: (error)=>{
            this.product = null;
          }
        });
      }
    })
    // this.productService.getProductByID();
  }
  
 addToCart(): void {
    if (!this.product) return;
    if (this.product.stock === 0) return;

    this.loading = true;

    this.cartService
      .addToCart(this.product._id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.loading = false;
        },
      });
  }

}

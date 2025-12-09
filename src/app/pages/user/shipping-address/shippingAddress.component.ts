import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';

import { ShippingAddress } from '../../../core/types/ShippingAdress';
import { ShippingAddressService } from '../../../core/services/shipping/shipping.service';
import { ShippingAdressListComponent } from '../../../components/shippingAdress/shipping-methods-list/shippingAdress-list.component';
import { ShippingFormComponent } from '../../../components/shippingAdress/shipping-form/shipping-form.component';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [ShippingAdressListComponent, AsyncPipe, ShippingFormComponent],
  templateUrl: './shippingAddress.component.html',
  styleUrl: './shippingAddress.component.css',
})
export class ShippingAddressComponent implements OnInit {
  shippingAddresses$: Observable<ShippingAddress[]> = of([]);
  selectedAddress: ShippingAddress | null = null;
  isEditing: boolean = false;

  constructor(private shippingAddressService: ShippingAddressService) {}

  ngOnInit(): void {
    // nos suscribimos al observable del servicio (como con paymentMethods)
    this.shippingAddresses$ = this.shippingAddressService.shippingAddresses$;
  }

  onEdit(address: ShippingAddress) {
    this.selectedAddress = address;
    this.isEditing = true;
  }

  onDelete(id: string) {
    if (confirm('¿Estás seguro de eliminar esta dirección de envío?')) {
      this.shippingAddressService.deleteShippingAddress(id).subscribe();
    }
  }

  onAddNew() {
    this.selectedAddress = null;
    this.isEditing = false;
  }

  onAddressSaved(payload: ShippingAddress) {
    if (this.isEditing) {
      this.shippingAddressService.editShippingAddress(payload).subscribe(() => {
        this.onAddNew();
      });
    } else {
      this.shippingAddressService.AddShippingAddress(payload).subscribe(() => {
        this.onAddNew();
      });
    }
  }
}





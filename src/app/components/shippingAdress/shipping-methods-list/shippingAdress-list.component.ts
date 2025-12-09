import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShippingAddress } from '../../../core/types/ShippingAdress';
import { ShippingAdressCardComponent } from '../shippingAdress-card/shippingAdress-card.component';

@Component({
  selector: 'app-shippingAdress-list',
  standalone: true,
  imports: [ShippingAdressCardComponent],
  templateUrl: './shippingAdress-list.component.html',
  styleUrl: './shippingAdress-list.component.css',
})
export class ShippingAdressListComponent {
  @Input() shippingAdresses: ShippingAddress[] = [];
  @Input() isEditable: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() selectedId: string | null = null;

  @Output() edit = new EventEmitter<ShippingAddress>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();

  onEdit(address: ShippingAddress) {
    this.edit.emit(address);
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }

  onSelect(id: string) {
    this.select.emit(id);
  }
}

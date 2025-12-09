import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShippingAddress } from '../../../core/types/ShippingAdress';

@Component({
  selector: 'app-shippingAdress-card',
  imports: [],
  standalone:true,
  templateUrl: './shippingAdress-card.component.html',
  styleUrl: './shippingAdress-card.component.css'
})
export class ShippingAdressCardComponent { 
  @Input() shippingAdress!: ShippingAddress;
  @Input() isEditable: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() isSelected: boolean = false;

  @Output() edit = new EventEmitter<ShippingAddress>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();
  
  get addressTypeLabel(): string {
    switch (this.shippingAdress?.addressType) {
      case 'home':
        return 'Casa';
      case 'work':
        return 'Trabajo';
      default:
        return 'Otra dirección';
    }
  }
  
  onSelectEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.shippingAdress);
  }
  
  onSelectDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.shippingAdress._id);
  }

  onCardClick() {
    if (this.isSelectable) {
      this.select.emit(this.shippingAdress._id);
    }
  }
}
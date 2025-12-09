import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaymentMethod } from '../../../core/types/PaymentMethod';

@Component({
  selector: 'app-payment-methods-card',
  imports: [],
  standalone:true,
  templateUrl: './payment-methods-card.component.html',
  styleUrl: './payment-methods-card.component.css'
})
export class PaymentMethodsCardComponent {
  @Input() paymentMethod!: PaymentMethod;
  @Input() isEditable: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() isSelected: boolean = false;

  @Output() edit = new EventEmitter<PaymentMethod>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();
  
  onSelectEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.paymentMethod);
  }
  
  onSelectDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.paymentMethod._id);
  }

  onCardClick() {
    if (this.isSelectable) {
      this.select.emit(this.paymentMethod._id);
    }
  }
}

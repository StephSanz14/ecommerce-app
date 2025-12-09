import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { PaymentMethodsCardComponent } from '../payment-methods-card/payment-methods-card.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-payment-methods-list',
  standalone: true,
  imports: [PaymentMethodsCardComponent],
  templateUrl: './payment-methods-list.component.html',
  styleUrl: './payment-methods-list.component.css'
})
export class PaymentMethodsListComponent {
  @Input() paymentMethods: PaymentMethod[] = [];
  @Input() isEditable: boolean = false; 
  @Input() isSelectable: boolean = false;
  @Input() selectedId: string | null = null;

  @Output() edit = new EventEmitter<PaymentMethod>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();

  onEdit(payment: PaymentMethod) {
    this.edit.emit(payment);
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }

  onSelect(id: string) {
    this.select.emit(id);
  }
}

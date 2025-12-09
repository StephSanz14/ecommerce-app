import { Component, OnInit } from '@angular/core';
import { PaymentMethodsListComponent } from "../../../components/payment/payment-methods-list/payment-methods-list.component";
import { PaymentFormComponent } from "../../../components/payment/payment-form/payment-form.component";
import { PaymentService } from '../../../core/services/paymentMethods/payment-methods.service';
import { Observable, of } from 'rxjs';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-paymethods',
  standalone: true,
  imports: [PaymentMethodsListComponent, PaymentFormComponent, AsyncPipe],
  templateUrl: './paymethods.component.html',
  styleUrl: './paymethods.component.css'
})
export class PaymethodsComponent implements OnInit {
  paymentMethods$: Observable<PaymentMethod[]> = of([]);
  selectedPaymentMethod: PaymentMethod | null = null;
  isEditing: boolean = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentMethods$ = this.paymentService.paymetMethods$;
  }

  onEdit(payment: PaymentMethod) {
    this.selectedPaymentMethod = payment;
    this.isEditing = true;
  }

  onDelete(id: string) {
    if(confirm('¿Estás seguro de eliminar este método de pago?')) {
      this.paymentService.deletePaymentMethod(id).subscribe();
    }
  }

  onAddNew() {
    this.selectedPaymentMethod = null;
    this.isEditing = false;
  }

  onPaymentSaved(payload: PaymentMethod) {
    if (this.isEditing) {
      this.paymentService.editPaymentMethod(payload).subscribe(() => {
        this.onAddNew(); 
      });
    } else {
      this.paymentService.addPaymentMethod(payload).subscribe(() => {
        this.onAddNew(); 
      });
    }
  }
}

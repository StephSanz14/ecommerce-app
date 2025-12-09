import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ShippingAddress } from '../../../core/types/ShippingAdress';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormErrorService } from '../../../core/services/validation/form-error.service';

@Component({
  selector: 'app-shippingAdress-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.css',
})
export class ShippingFormComponent implements OnChanges {
  @Input() address: ShippingAddress | null = null;
  @Input() isEditMode: boolean = false;
  @Output() addressSaved = new EventEmitter<ShippingAddress>();

  shippingForm: FormGroup;

  private formErrorService = inject(FormErrorService);

  constructor(private fb: FormBuilder) {
    this.shippingForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address) {
      this.populateForm();
    }

    // Si cambias de "nuevo" a "editar" y quieres limpiar cuando no hay address:
    if (changes['address'] && !this.address) {
      this.shippingForm.reset({
        country: 'México',
        addressType: 'home',
        isDefault: false,
      });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
      ],
      country: ['México', [Validators.required]],
      phone: ['', [Validators.required]],
      addressType: ['home', [Validators.required]], // home | work | other
      isDefault: [false],
    });
  }

  private populateForm(): void {
    if (!this.address) return;

    this.shippingForm.patchValue({
      name: this.address.name || '',
      address: this.address.address || '',
      city: this.address.city || '',
      state: this.address.state || '',
      postalCode: this.address.postalCode || '',
      country: this.address.country || 'México',
      phone: this.address.phone || '',
      addressType: this.address.addressType || 'home',
      isDefault: this.address.isDefault ?? false,
    });
  }

  getFieldError(fieldName: string): string {
    const customLabels: Record<string, string> = {
      name: 'Nombre de la dirección',
      address: 'Dirección',
      city: 'Ciudad',
      state: 'Estado',
      postalCode: 'Código postal',
      country: 'País',
      phone: 'Teléfono',
      addressType: 'Tipo de dirección',
      isDefault: 'Predeterminada',
    };

    return this.formErrorService.getFieldError(
      this.shippingForm,
      fieldName,
      customLabels
    );
  }

  onSubmit(): void {
    if (this.shippingForm.invalid) {
      // aquí podrías marcar todos como touched si tu FormErrorService lo maneja
      return;
    }

    const form = this.shippingForm.value;

    const formData: ShippingAddress = {
      _id: this.address?._id ?? '',        // en "nuevo" irá vacío, el backend lo genera
      user: this.address?.user ?? '',      // el servicio lo sobreescribe con el userId en AddShippingAddress
      name: form.name,
      address: form.address,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      phone: form.phone,
      isDefault: form.isDefault ?? false,
      addressType: form.addressType,
    };

    this.addressSaved.emit(formData);
  }
}

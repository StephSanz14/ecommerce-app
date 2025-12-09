import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodsCardComponent } from './payment-methods-card.component';

describe('PaymentMethodsCardComponent', () => {
  let component: PaymentMethodsCardComponent;
  let fixture: ComponentFixture<PaymentMethodsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

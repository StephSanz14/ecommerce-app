import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment-methods.service';

describe('PaymentMethodsService', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FamilyBenefitState } from './family-benefit-state';

describe('FamilyBenefitState', () => {
  let service: FamilyBenefitState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyBenefitState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

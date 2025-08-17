import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDetails } from './income-details';

describe('IncomeDetails', () => {
  let component: IncomeDetails;
  let fixture: ComponentFixture<IncomeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

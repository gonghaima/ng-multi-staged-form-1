import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FamilyBenefitStateService } from '../../services/family-benefit-state';
import { IncomeDetails } from '../../models/family-benefit.models';

@Component({
  selector: 'app-income-details',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './income-details.html',
  styleUrl: './income-details.css'
})
export class IncomeDetailsComponent implements OnInit {
  private stateService = inject(FamilyBenefitStateService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  incomeForm = this.fb.group({
    employmentStatus: ['', Validators.required],
    annualIncome: [0, [Validators.required, Validators.min(0)]],
    employer: [''],
    otherIncome: [0, Validators.min(0)]
  });

  employmentOptions = [
    'Employed Full-time',
    'Employed Part-time',
    'Self-employed',
    'Unemployed',
    'Student',
    'Retired',
    'Other'
  ];

  ngOnInit() {
    const existingData = this.stateService.incomeDetails();
    if (existingData) {
      this.incomeForm.patchValue(existingData);
    }
  }

  onSubmit() {
    if (this.incomeForm.valid) {
      this.stateService.updateIncomeDetails(this.incomeForm.value as IncomeDetails);
      this.stateService.setCurrentStep(3);
      this.router.navigate(['/partner-details']);
    }
  }

  onBack() {
    // Save current form data before going back (even if not completely valid)
    this.saveCurrentData();
    this.stateService.setCurrentStep(1);
    this.router.navigate(['/personal-details']);
  }

  private saveCurrentData() {
    // Save form data even if not completely valid to preserve user input
    const formValue = this.incomeForm.value;
    if (formValue.employmentStatus || formValue.annualIncome || formValue.employer || formValue.otherIncome) {
      this.stateService.updateIncomeDetails(formValue as IncomeDetails);
    }
  }
}

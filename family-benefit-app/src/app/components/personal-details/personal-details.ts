import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FamilyBenefitStateService } from '../../services/family-benefit-state';
import { PersonalDetails } from '../../models/family-benefit.models';

@Component({
  selector: 'app-personal-details',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './personal-details.html',
  styleUrl: './personal-details.css'
})
export class PersonalDetailsComponent implements OnInit {
  private stateService = inject(FamilyBenefitStateService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  personalForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    }),
    phoneNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    // Pre-populate form if data exists
    const existingData = this.stateService.personalDetails();
    if (existingData) {
      this.personalForm.patchValue(existingData);
    }
  }

  onSubmit() {
    if (this.personalForm.valid) {
      this.stateService.updatePersonalDetails(this.personalForm.value as PersonalDetails);
      this.stateService.setCurrentStep(2);
      this.router.navigate(['/income-details']);
    }
  }

  onBack() {
    // Save current form data before going back (if there was a previous step)
    this.saveCurrentData();
    // Could navigate to a welcome page or previous step
  }

  private saveCurrentData() {
    // Save form data even if not completely valid to preserve user input
    const formValue = this.personalForm.value;
    if (formValue.firstName || formValue.lastName || formValue.email) {
      this.stateService.updatePersonalDetails(formValue as PersonalDetails);
    }
  }
}

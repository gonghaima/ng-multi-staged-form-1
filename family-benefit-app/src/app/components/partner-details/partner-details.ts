import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FamilyBenefitStateService } from '../../services/family-benefit-state';
import { PartnerDetails } from '../../models/family-benefit.models';

@Component({
  selector: 'app-partner-details',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './partner-details.html',
  styleUrl: './partner-details.css'
})
export class PartnerDetailsComponent implements OnInit {
  private stateService = inject(FamilyBenefitStateService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  partnerForm = this.fb.group({
    hasPartner: [false, Validators.required],
    partnerFirstName: [''],
    partnerLastName: [''],
    partnerIncome: [0, Validators.min(0)]
  });

  ngOnInit() {
    const existingData = this.stateService.partnerDetails();
    if (existingData) {
      this.partnerForm.patchValue(existingData);
    }

    // Watch for changes in hasPartner to set validators
    this.partnerForm.get('hasPartner')?.valueChanges.subscribe(hasPartner => {
      const firstNameControl = this.partnerForm.get('partnerFirstName');
      const lastNameControl = this.partnerForm.get('partnerLastName');
      
      if (hasPartner) {
        firstNameControl?.setValidators([Validators.required]);
        lastNameControl?.setValidators([Validators.required]);
      } else {
        firstNameControl?.clearValidators();
        lastNameControl?.clearValidators();
      }
      
      firstNameControl?.updateValueAndValidity();
      lastNameControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.partnerForm.valid) {
      this.stateService.updatePartnerDetails(this.partnerForm.value as PartnerDetails);
      this.stateService.setCurrentStep(4);
      this.router.navigate(['/review']);
    }
  }

  onBack() {
    // Save current form data before going back (even if not completely valid)
    this.saveCurrentData();
    this.stateService.setCurrentStep(2);
    this.router.navigate(['/income-details']);
  }

  private saveCurrentData() {
    // Save form data even if not completely valid to preserve user input
    const formValue = this.partnerForm.value;
    this.stateService.updatePartnerDetails(formValue as PartnerDetails);
  }
}

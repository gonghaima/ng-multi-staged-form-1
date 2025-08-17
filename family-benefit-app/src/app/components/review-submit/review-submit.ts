import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FamilyBenefitStateService } from '../../services/family-benefit-state';

@Component({
  selector: 'app-review-submit',
  imports: [CommonModule],
  templateUrl: './review-submit.html',
  styleUrl: './review-submit.css'
})
export class ReviewSubmitComponent {
  private stateService = inject(FamilyBenefitStateService);
  private router = inject(Router);

  // Expose state as signals
  personalDetails = this.stateService.personalDetails;
  incomeDetails = this.stateService.incomeDetails;
  partnerDetails = this.stateService.partnerDetails;
  canSubmit = this.stateService.canSubmit;
  isLoading = this.stateService.isLoading;
  errors = this.stateService.errors;
  isSubmitted = this.stateService.isSubmitted;

  submit() {
    this.stateService.submitApplication();
  }

  goBack() {
    this.stateService.setCurrentStep(3);
    this.router.navigate(['/partner-details']);
  }

  editPersonalDetails() {
    this.router.navigate(['/personal-details']);
  }

  editIncomeDetails() {
    this.router.navigate(['/income-details']);
  }

  editPartnerDetails() {
    this.router.navigate(['/partner-details']);
  }

  startNewApplication() {
    this.stateService.resetApplication();
    this.router.navigate(['/personal-details']);
  }
}

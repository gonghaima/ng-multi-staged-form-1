import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  FamilyBenefitState, 
  PersonalDetails, 
  IncomeDetails, 
  PartnerDetails 
} from '../models/family-benefit.models';

@Injectable({
  providedIn: 'root'
})
export class FamilyBenefitStateService {
  private state = signal<FamilyBenefitState>({
    personalDetails: null,
    incomeDetails: null,
    partnerDetails: null,
    currentStep: 1,
    isLoading: false,
    errors: [],
    isSubmitted: false
  });

  // Computed selectors
  readonly personalDetails = computed(() => this.state().personalDetails);
  readonly incomeDetails = computed(() => this.state().incomeDetails);
  readonly partnerDetails = computed(() => this.state().partnerDetails);
  readonly currentStep = computed(() => this.state().currentStep);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errors = computed(() => this.state().errors);
  readonly isSubmitted = computed(() => this.state().isSubmitted);
  
  // Check if all required data is collected
  readonly canSubmit = computed(() => {
    const state = this.state();
    return state.personalDetails !== null && 
           state.incomeDetails !== null && 
           state.partnerDetails !== null;
  });

  constructor(private http: HttpClient) {}

  // Actions
  updatePersonalDetails(details: PersonalDetails) {
    this.state.update(state => ({
      ...state,
      personalDetails: details,
      errors: []
    }));
  }

  updateIncomeDetails(details: IncomeDetails) {
    this.state.update(state => ({
      ...state,
      incomeDetails: details,
      errors: []
    }));
  }

  updatePartnerDetails(details: PartnerDetails) {
    this.state.update(state => ({
      ...state,
      partnerDetails: details,
      errors: []
    }));
  }

  setCurrentStep(step: number) {
    this.state.update(state => ({
      ...state,
      currentStep: step
    }));
  }

  setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading: loading
    }));
  }

  setErrors(errors: string[]) {
    this.state.update(state => ({
      ...state,
      errors
    }));
  }

  async submitApplication() {
    const currentState = this.state();
    
    if (!this.canSubmit()) {
      this.setErrors(['Please complete all required sections']);
      return;
    }

    this.setLoading(true);
    this.setErrors([]);

    try {
      const applicationData = {
        personalDetails: currentState.personalDetails,
        incomeDetails: currentState.incomeDetails,
        partnerDetails: currentState.partnerDetails
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Application submitted:', applicationData);
      
      this.state.update(state => ({
        ...state,
        isSubmitted: true,
        isLoading: false
      }));
    } catch (error) {
      this.setErrors(['Failed to submit application. Please try again.']);
      this.setLoading(false);
    }
  }

  resetApplication() {
    this.state.set({
      personalDetails: null,
      incomeDetails: null,
      partnerDetails: null,
      currentStep: 1,
      isLoading: false,
      errors: [],
      isSubmitted: false
    });
  }
}

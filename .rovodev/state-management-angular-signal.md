# State Management Using Angular Signal

## Overview

This instruction covers implementing state management using Angular signals for a family benefit application. The application follows a multi-page flow to collect user information and submit it to a backend API.

## Application Flow

The family benefit application consists of multiple pages:

1. **Personal Details Page** - Collect user's personal information
2. **Income Details Page** - Collect user's income information  
3. **Partner Details Page** - Collect user's partner information
4. **Review and Submit Page** - Display collected data for review and submit to backend

## State Management Architecture

### Core Concepts

- Use Angular signals for reactive state management
- Centralized state store similar to NgRx/Redux patterns
- Immutable state updates
- Type-safe state management

### State Structure

```typescript
interface FamilyBenefitState {
  personalDetails: PersonalDetails | null;
  incomeDetails: IncomeDetails | null;
  partnerDetails: PartnerDetails | null;
  currentStep: number;
  isLoading: boolean;
  errors: string[];
  isSubmitted: boolean;
}

interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  phoneNumber: string;
  email: string;
}

interface IncomeDetails {
  employmentStatus: string;
  annualIncome: number;
  employer?: string;
  otherIncome?: number;
}

interface PartnerDetails {
  hasPartner: boolean;
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerIncome?: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
```

### State Service Implementation

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

      await this.http.post('/api/family-benefit/submit', applicationData).toPromise();
      
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
```

### Component Usage Examples

#### Personal Details Component

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FamilyBenefitStateService } from './family-benefit-state.service';

@Component({
  selector: 'app-personal-details',
  template: `
    <form [formGroup]="personalForm" (ngSubmit)="onSubmit()">
      <h2>Personal Details</h2>
      
      <input formControlName="firstName" placeholder="First Name" />
      <input formControlName="lastName" placeholder="Last Name" />
      <input formControlName="dateOfBirth" type="date" placeholder="Date of Birth" />
      
      <div formGroupName="address">
        <input formControlName="street" placeholder="Street Address" />
        <input formControlName="city" placeholder="City" />
        <input formControlName="state" placeholder="State" />
        <input formControlName="zipCode" placeholder="ZIP Code" />
      </div>
      
      <input formControlName="phoneNumber" placeholder="Phone Number" />
      <input formControlName="email" type="email" placeholder="Email" />
      
      <button type="submit" [disabled]="personalForm.invalid">
        Next: Income Details
      </button>
    </form>
  `
})
export class PersonalDetailsComponent {
  private stateService = inject(FamilyBenefitStateService);
  private fb = inject(FormBuilder);

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
      // Navigate to income details page
    }
  }
}
```

#### Review and Submit Component

```typescript
import { Component, inject } from '@angular/core';
import { FamilyBenefitStateService } from './family-benefit-state.service';

@Component({
  selector: 'app-review-submit',
  template: `
    <div class="review-container">
      <h2>Review Your Application</h2>
      
      @if (errors().length > 0) {
        <div class="errors">
          @for (error of errors(); track error) {
            <p class="error">{{ error }}</p>
          }
        </div>
      }
      
      <div class="review-section">
        <h3>Personal Details</h3>
        @if (personalDetails(); as details) {
          <p>Name: {{ details.firstName }} {{ details.lastName }}</p>
          <p>Date of Birth: {{ details.dateOfBirth }}</p>
          <p>Email: {{ details.email }}</p>
          <p>Phone: {{ details.phoneNumber }}</p>
          <p>Address: {{ details.address.street }}, {{ details.address.city }}, {{ details.address.state }} {{ details.address.zipCode }}</p>
        }
      </div>
      
      <div class="review-section">
        <h3>Income Details</h3>
        @if (incomeDetails(); as details) {
          <p>Employment Status: {{ details.employmentStatus }}</p>
          <p>Annual Income: ${{ details.annualIncome }}</p>
          @if (details.employer) {
            <p>Employer: {{ details.employer }}</p>
          }
        }
      </div>
      
      <div class="review-section">
        <h3>Partner Details</h3>
        @if (partnerDetails(); as details) {
          @if (details.hasPartner) {
            <p>Partner: {{ details.partnerFirstName }} {{ details.partnerLastName }}</p>
            <p>Partner Income: ${{ details.partnerIncome }}</p>
          } @else {
            <p>No partner</p>
          }
        }
      </div>
      
      <div class="actions">
        <button (click)="goBack()">Back to Edit</button>
        <button 
          (click)="submit()" 
          [disabled]="!canSubmit() || isLoading()"
          class="submit-btn">
          @if (isLoading()) {
            Submitting...
          } @else {
            Submit Application
          }
        </button>
      </div>
      
      @if (isSubmitted()) {
        <div class="success">
          <h3>Application Submitted Successfully!</h3>
          <p>Your family benefit application has been received.</p>
        </div>
      }
    </div>
  `
})
export class ReviewSubmitComponent {
  private stateService = inject(FamilyBenefitStateService);

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
    this.stateService.setCurrentStep(3); // Go back to partner details
  }
}
```

## Navigation and Routing

### Route Configuration

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/personal-details', pathMatch: 'full' },
  { path: 'personal-details', component: PersonalDetailsComponent },
  { path: 'income-details', component: IncomeDetailsComponent },
  { path: 'partner-details', component: PartnerDetailsComponent },
  { path: 'review', component: ReviewSubmitComponent },
];
```

### Navigation Guard

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FamilyBenefitStateService } from './family-benefit-state.service';

export const stepGuard: CanActivateFn = (route) => {
  const stateService = inject(FamilyBenefitStateService);
  const router = inject(Router);
  const currentStep = stateService.currentStep();
  
  const routeStepMap: { [key: string]: number } = {
    'personal-details': 1,
    'income-details': 2,
    'partner-details': 3,
    'review': 4
  };
  
  const requiredStep = routeStepMap[route.url[0]?.path || ''];
  
  if (currentStep < requiredStep) {
    // Redirect to current step
    const stepRouteMap = ['', 'personal-details', 'income-details', 'partner-details', 'review'];
    router.navigate([stepRouteMap[currentStep]]);
    return false;
  }
  
  return true;
};
```

## Best Practices

1. **Immutable Updates**: Always use the `update()` method with spread operators to ensure immutability
2. **Type Safety**: Define comprehensive TypeScript interfaces for all state shapes
3. **Computed Values**: Use computed signals for derived state to ensure reactivity
4. **Error Handling**: Implement proper error handling for API calls and form validation
5. **Loading States**: Track loading states for better user experience
6. **Navigation Guards**: Prevent users from accessing steps they haven't completed
7. **Data Persistence**: Consider implementing local storage persistence for form data
8. **Validation**: Implement both client-side and server-side validation

## Testing

```typescript
describe('FamilyBenefitStateService', () => {
  let service: FamilyBenefitStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyBenefitStateService);
  });

  it('should update personal details', () => {
    const personalDetails: PersonalDetails = {
      firstName: 'John',
      lastName: 'Doe',
      // ... other properties
    };

    service.updatePersonalDetails(personalDetails);
    
    expect(service.personalDetails()).toEqual(personalDetails);
  });

  it('should enable submit when all data is collected', () => {
    // Set up all required data
    service.updatePersonalDetails(mockPersonalDetails);
    service.updateIncomeDetails(mockIncomeDetails);
    service.updatePartnerDetails(mockPartnerDetails);
    
    expect(service.canSubmit()).toBe(true);
  });
});
```

This approach provides a robust, type-safe state management solution using Angular signals that scales well for multi-step forms and complex application flows.
export interface FamilyBenefitState {
  personalDetails: PersonalDetails | null;
  incomeDetails: IncomeDetails | null;
  partnerDetails: PartnerDetails | null;
  currentStep: number;
  isLoading: boolean;
  errors: string[];
  isSubmitted: boolean;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  phoneNumber: string;
  email: string;
}

export interface IncomeDetails {
  employmentStatus: string;
  annualIncome: number;
  employer?: string;
  otherIncome?: number;
}

export interface PartnerDetails {
  hasPartner: boolean;
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerIncome?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
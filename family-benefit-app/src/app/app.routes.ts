import { Routes } from '@angular/router';
import { PersonalDetailsComponent } from './components/personal-details/personal-details';
import { IncomeDetailsComponent } from './components/income-details/income-details';
import { PartnerDetailsComponent } from './components/partner-details/partner-details';
import { ReviewSubmitComponent } from './components/review-submit/review-submit';

export const routes: Routes = [
  { path: '', redirectTo: '/personal-details', pathMatch: 'full' },
  { path: 'personal-details', component: PersonalDetailsComponent },
  { path: 'income-details', component: IncomeDetailsComponent },
  { path: 'partner-details', component: PartnerDetailsComponent },
  { path: 'review', component: ReviewSubmitComponent },
];

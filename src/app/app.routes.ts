import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ResourcesComponent } from './resources/resources.component';
import { IacErrorsComponent } from './iac-errors/iac-errors.component';
import { IacComponent } from './iac/iac.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'politica-de-privacidade',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'politica-de-cookies',
    component: CookiePolicyComponent,
  },
  {
    path: 'recursos',
    component: ResourcesComponent,
  },
  {
    path: 'recursos_iac',
    component: IacComponent,
  },
  {
    path: 'recursos_iac_errors',
    component: IacErrorsComponent,
  },
  {
    path: 'recursos_iac_errors',
    component: IacErrorsComponent,
  },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ResourcesComponent } from './resources/resources.component';

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
];

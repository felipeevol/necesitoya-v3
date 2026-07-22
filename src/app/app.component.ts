import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component';
import { SiteHeaderComponent } from './site-header/site-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CookieBannerComponent, SiteHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}

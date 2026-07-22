import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Locale, Translation } from '../shared/site-translations';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
})
export class SiteHeaderComponent {
  private readonly language = inject(SiteLanguageService);

  readonly languageOptions = this.language.languageOptions;

  get currentLocale(): Locale {
    return this.language.currentLocale();
  }

  get currentTranslations(): Translation {
    return this.language.currentTranslations();
  }

  setLanguage(locale: Locale): void {
    this.language.setLanguage(locale);
  }

  getLanguageLabel(locale: Locale): string {
    return this.language.getLanguageLabel(locale);
  }
}

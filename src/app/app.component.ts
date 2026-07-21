import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Amplify } from 'aws-amplify';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import outputs from '../../amplify_outputs.json';
import enTranslations from '../assets/i18n/en.json';
import esTranslations from '../assets/i18n/es.json';
import ptTranslations from '../assets/i18n/pt.json';

Amplify.configure(outputs);

const translations = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

type Locale = keyof typeof translations;
type Translation = (typeof translations)[Locale];
type ErrorMessageKey = keyof Translation['contact']['errors'];

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, FormsModule, RecaptchaModule],
})
export class AppComponent {
  showSuccessMessage = false;
  errorMessageKey: ErrorMessageKey | null = null;
  isSubmitting = false;
  recaptchaToken: string | null = null;
  currentLocale: Locale = 'en';
  currentTranslations: Translation = translations.en;
  readonly languageOptions: ReadonlyArray<{ code: Locale; flagSrc: string }> = [
    { code: 'pt', flagSrc: 'assets/flags/pt.svg' },
    { code: 'en', flagSrc: 'assets/flags/en.svg' },
    { code: 'es', flagSrc: 'assets/flags/es.svg' },
  ];
  private readonly languageStorageKey = 'app-language';
  private readonly languagePreferenceSourceKey = 'app-language-source';
  private readonly manualLanguagePreference = 'manual';
  private readonly fallbackLocale: Locale = 'en';

  @ViewChild(RecaptchaComponent) recaptchaComponent?: RecaptchaComponent;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const savedLocale = this.getSavedLocale();
    this.applyLanguage(this.getInitialLocale(savedLocale));
  }

  get errorMessage(): string {
    return this.errorMessageKey
      ? this.currentTranslations.contact.errors[this.errorMessageKey]
      : '';
  }

  setLanguage(locale: Locale): void {
    if (locale === this.currentLocale) {
      return;
    }

    this.applyLanguage(locale);
    localStorage.setItem(this.languageStorageKey, locale);
    localStorage.setItem(this.languagePreferenceSourceKey, this.manualLanguagePreference);
  }

  getLanguageLabel(locale: Locale): string {
    return this.currentTranslations.languages.options[locale];
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.showSuccessMessage = false;
    this.errorMessageKey = null;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.recaptchaToken) {
      this.errorMessageKey = 'recaptchaRequired';
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('email', form.value.email ?? '');
    formData.append('subject', form.value.subject ?? '');
    formData.append('message', form.value.message ?? '');
    formData.append('_captcha', 'false');
    formData.append('g-recaptcha-response', this.recaptchaToken);

    try {
      const response = await fetch('https://formsubmit.co/ajax/felipe@profesionaljava.es', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      this.showSuccessMessage = true;
      form.resetForm();
      this.resetRecaptcha();

      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      this.errorMessageKey = 'submitFailed';
      this.resetRecaptcha();
    } finally {
      this.isSubmitting = false;
    }
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken = token;

    if (token) {
      this.errorMessageKey = null;
    }
  }

  private applyLanguage(locale: Locale): void {
    this.currentLocale = locale;
    this.currentTranslations = translations[locale];
    this.document.documentElement.lang = locale;
  }

  private getInitialLocale(savedLocale: string | null): Locale {
    if (this.isLocale(savedLocale)) {
      return savedLocale;
    }

    const navigator = this.document.defaultView?.navigator;
    const browserLocales = [
      navigator?.language,
      ...(navigator?.languages ?? []),
    ].filter((value, index, locales): value is string =>
      Boolean(value) && locales.indexOf(value) === index,
    );

    for (const browserLocale of browserLocales) {
      const normalizedLocale = this.normalizeLocale(browserLocale);

      if (this.isLocale(normalizedLocale)) {
        return normalizedLocale;
      }
    }

    return this.fallbackLocale;
  }

  private getSavedLocale(): string | null {
    if (localStorage.getItem(this.languagePreferenceSourceKey) !== this.manualLanguagePreference) {
      localStorage.removeItem(this.languageStorageKey);
      return null;
    }

    return localStorage.getItem(this.languageStorageKey);
  }

  private isLocale(value: string | null): value is Locale {
    return value === 'pt' || value === 'en' || value === 'es';
  }

  private normalizeLocale(locale: string): string {
    return locale.toLowerCase().split('-')[0];
  }

  private resetRecaptcha(): void {
    this.recaptchaToken = null;
    this.recaptchaComponent?.reset();
  }
}

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
  currentLocale: Locale = 'pt';
  currentTranslations: Translation = translations.pt;
  readonly languageOptions: ReadonlyArray<{ code: Locale; flag: string }> = [
    { code: 'pt', flag: '🇵🇹' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'es', flag: '🇪🇸' },
  ];
  private readonly languageStorageKey = 'app-language';

  @ViewChild(RecaptchaComponent) recaptchaComponent?: RecaptchaComponent;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const savedLocale = localStorage.getItem(this.languageStorageKey);
    this.applyLanguage(this.isLocale(savedLocale) ? savedLocale : 'pt');
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

  private isLocale(value: string | null): value is Locale {
    return value === 'pt' || value === 'en' || value === 'es';
  }

  private resetRecaptcha(): void {
    this.recaptchaToken = null;
    this.recaptchaComponent?.reset();
  }
}

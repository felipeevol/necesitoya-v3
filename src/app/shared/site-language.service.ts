import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, computed, signal } from '@angular/core';
import { Locale, Translation, languageOptions, translations } from './site-translations';

@Injectable({
  providedIn: 'root',
})
export class SiteLanguageService {
  readonly currentLocale = signal<Locale>('en');
  readonly currentTranslations = computed<Translation>(() => translations[this.currentLocale()]);
  readonly languageOptions = languageOptions;

  private readonly languageStorageKey = 'app-language';
  private readonly languagePreferenceSourceKey = 'app-language-source';
  private readonly manualLanguagePreference = 'manual';
  private readonly fallbackLocale: Locale = 'en';

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const savedLocale = this.getSavedLocale();
    this.applyLanguage(this.getInitialLocale(savedLocale));
  }

  setLanguage(locale: Locale): void {
    if (locale === this.currentLocale()) {
      return;
    }

    this.applyLanguage(locale);

    const storage = this.getLocalStorage();
    storage?.setItem(this.languageStorageKey, locale);
    storage?.setItem(this.languagePreferenceSourceKey, this.manualLanguagePreference);
  }

  getLanguageLabel(locale: Locale): string {
    return this.currentTranslations().languages.options[locale];
  }

  private applyLanguage(locale: Locale): void {
    this.currentLocale.set(locale);
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
    const storage = this.getLocalStorage();

    if (!storage) {
      return null;
    }

    if (storage.getItem(this.languagePreferenceSourceKey) !== this.manualLanguagePreference) {
      storage.removeItem(this.languageStorageKey);
      return null;
    }

    return storage.getItem(this.languageStorageKey);
  }

  private getLocalStorage(): Storage | null {
    return this.document.defaultView?.localStorage ?? null;
  }

  private isLocale(value: string | null): value is Locale {
    return value === 'pt' || value === 'en' || value === 'es';
  }

  private normalizeLocale(locale: string): string {
    return locale.toLowerCase().split('-')[0];
  }
}

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

type Locale = 'pt' | 'en' | 'es';

type CookieBannerContent = {
  title: string;
  description: string;
  policyLeadIn: string;
  linkLabel: string;
  actionLabel: string;
};

const bannerContent: Record<Locale, CookieBannerContent> = {
  pt: {
    title: 'Cookies essenciais',
    description:
      'Este website utiliza apenas cookies estritamente necessários para garantir o seu correto funcionamento e a segurança dos serviços. Estes cookies não podem ser desativados, uma vez que são indispensáveis ao funcionamento do website.',
    policyLeadIn: 'Para mais informações, consulte a nossa',
    linkLabel: 'Política de Cookies',
    actionLabel: 'Compreendido',
  },
  en: {
    title: 'Essential cookies',
    description:
      'This website uses only strictly necessary cookies to ensure its proper operation and the security of its services. These cookies cannot be disabled, as they are essential for the website to function.',
    policyLeadIn: 'For more information, please see our',
    linkLabel: 'Cookie Policy',
    actionLabel: 'Understood',
  },
  es: {
    title: 'Cookies esenciales',
    description:
      'Este sitio web utiliza únicamente cookies estrictamente necesarias para garantizar su correcto funcionamiento y la seguridad de los servicios. Estas cookies no pueden desactivarse, ya que son indispensables para el funcionamiento del sitio web.',
    policyLeadIn: 'Para más información, consulta nuestra',
    linkLabel: 'Política de Cookies',
    actionLabel: 'Entendido',
  },
};

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.css',
})
export class CookieBannerComponent implements OnDestroy {
  showBanner = true;
  currentLocale: Locale = 'pt';
  currentContent: CookieBannerContent = bannerContent.pt;

  private readonly cookieBannerStorageKey = 'cookie-banner-acknowledged';
  private readonly languageStorageKey = 'app-language';
  private readonly languagePreferenceSourceKey = 'app-language-source';
  private readonly manualLanguagePreference = 'manual';
  private readonly fallbackLocale: Locale = 'pt';
  private readonly languageObserver: MutationObserver;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.showBanner = localStorage.getItem(this.cookieBannerStorageKey) !== 'true';
    this.applyLanguage(this.resolveLocale());
    this.languageObserver = new MutationObserver(() => {
      this.applyLanguage(this.resolveLocale());
    });
    this.languageObserver.observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
  }

  ngOnDestroy(): void {
    this.languageObserver.disconnect();
  }

  acknowledge(): void {
    localStorage.setItem(this.cookieBannerStorageKey, 'true');
    this.showBanner = false;
  }

  private applyLanguage(locale: Locale): void {
    this.currentLocale = locale;
    this.currentContent = bannerContent[locale];
  }

  private resolveLocale(): Locale {
    const documentLocale = this.normalizeLocale(this.document.documentElement.lang);

    if (this.isLocale(documentLocale)) {
      return documentLocale;
    }

    const savedLocale = this.getSavedLocale();

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
      return null;
    }

    return localStorage.getItem(this.languageStorageKey);
  }

  private isLocale(value: string | null): value is Locale {
    return value === 'pt' || value === 'en' || value === 'es';
  }

  private normalizeLocale(locale: string | null): string | null {
    return locale ? locale.toLowerCase().split('-')[0] : null;
  }
}

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import enTranslations from '../../assets/i18n/en.json';
import esTranslations from '../../assets/i18n/es.json';
import ptTranslations from '../../assets/i18n/pt.json';

const translations = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

type Locale = keyof typeof translations;
type Translation = (typeof translations)[Locale];

type PolicySection = {
  title: string;
  paragraphs: string[];
  items?: string[];
  emailLabel?: string;
};

type PolicyContent = {
  title: string;
  subtitle: string;
  updatedAtLabel: string;
  updatedAtValue: string;
  backToHome: string;
  sections: PolicySection[];
};

const policyContent: Record<Locale, PolicyContent> = {
  pt: {
    title: 'Política de Cookies',
    subtitle: 'Explicamos que cookies utilizamos neste website e qual a sua finalidade.',
    updatedAtLabel: 'Última atualização',
    updatedAtValue: '22 de julho de 2026',
    backToHome: 'Voltar à página principal',
    sections: [
      {
        title: '1. O que são cookies?',
        paragraphs: [
          'Os cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website. Servem para garantir o correto funcionamento do site e, em alguns casos, melhorar a experiência do utilizador.',
        ],
      },
      {
        title: '2. Que cookies utilizamos?',
        paragraphs: [
          'Atualmente, este website utiliza apenas cookies estritamente necessários ao seu funcionamento.',
          'Estes cookies não são utilizados para publicidade, criação de perfis ou análise do comportamento dos utilizadores.',
          'Estes cookies permitem, por exemplo:',
        ],
        items: [
          'Garantir a segurança do website.',
          'Proteger os formulários contra utilização abusiva.',
          'Manter o correto funcionamento das funcionalidades essenciais.',
        ],
      },
      {
        title: '3. Consentimento',
        paragraphs: [
          'Nos termos da legislação aplicável, os cookies estritamente necessários não requerem o consentimento prévio do utilizador, uma vez que são indispensáveis para o funcionamento do website.',
        ],
      },
      {
        title: '4. Gestão de cookies',
        paragraphs: [
          'Pode configurar o seu navegador para bloquear ou eliminar cookies. No entanto, a desativação dos cookies estritamente necessários poderá impedir o correto funcionamento de algumas funcionalidades deste website.',
        ],
      },
      {
        title: '5. Alterações a esta política',
        paragraphs: [
          'Esta Política de Cookies poderá ser atualizada periodicamente para refletir alterações legais ou técnicas. A versão mais recente estará sempre disponível nesta página.',
        ],
      },
      {
        title: '6. Contacto',
        paragraphs: [
          'Se tiver alguma questão sobre esta Política de Cookies, pode contactar-nos através de:',
        ],
        emailLabel: 'E-mail',
      },
    ],
  },
  en: {
    title: 'Cookie Policy',
    subtitle: 'We explain which cookies we use on this website and what they are used for.',
    updatedAtLabel: 'Last updated',
    updatedAtValue: 'July 22, 2026',
    backToHome: 'Back to the main page',
    sections: [
      {
        title: '1. What are cookies?',
        paragraphs: [
          'Cookies are small text files stored on your device when you visit a website. They help ensure the proper functioning of the site and, in some cases, improve the user experience.',
        ],
      },
      {
        title: '2. Which cookies do we use?',
        paragraphs: [
          'At present, this website uses only strictly necessary cookies for its operation.',
          'These cookies are not used for advertising, profiling, or analyzing user behavior.',
          'These cookies allow, for example:',
        ],
        items: [
          'Ensuring the security of the website.',
          'Protecting forms against abusive use.',
          'Maintaining the proper functioning of essential features.',
        ],
      },
      {
        title: '3. Consent',
        paragraphs: [
          'Under applicable legislation, strictly necessary cookies do not require the user’s prior consent, as they are indispensable for the operation of the website.',
        ],
      },
      {
        title: '4. Managing cookies',
        paragraphs: [
          'You can configure your browser to block or delete cookies. However, disabling strictly necessary cookies may prevent some features of this website from functioning properly.',
        ],
      },
      {
        title: '5. Changes to this policy',
        paragraphs: [
          'This Cookie Policy may be updated periodically to reflect legal or technical changes. The most recent version will always be available on this page.',
        ],
      },
      {
        title: '6. Contact',
        paragraphs: [
          'If you have any questions about this Cookie Policy, you can contact us at:',
        ],
        emailLabel: 'Email',
      },
    ],
  },
  es: {
    title: 'Política de Cookies',
    subtitle: 'Explicamos qué cookies utilizamos en este sitio web y cuál es su finalidad.',
    updatedAtLabel: 'Última actualización',
    updatedAtValue: '22 de julio de 2026',
    backToHome: 'Volver a la página principal',
    sections: [
      {
        title: '1. ¿Qué son las cookies?',
        paragraphs: [
          'Las cookies son pequeños archivos de texto almacenados en tu dispositivo cuando visitas un sitio web. Sirven para garantizar el correcto funcionamiento del sitio y, en algunos casos, mejorar la experiencia del usuario.',
        ],
      },
      {
        title: '2. ¿Qué cookies utilizamos?',
        paragraphs: [
          'Actualmente, este sitio web utiliza únicamente cookies estrictamente necesarias para su funcionamiento.',
          'Estas cookies no se utilizan para publicidad, creación de perfiles ni análisis del comportamiento de los usuarios.',
          'Estas cookies permiten, por ejemplo:',
        ],
        items: [
          'Garantizar la seguridad del sitio web.',
          'Proteger los formularios contra usos abusivos.',
          'Mantener el correcto funcionamiento de las funcionalidades esenciales.',
        ],
      },
      {
        title: '3. Consentimiento',
        paragraphs: [
          'De acuerdo con la legislación aplicable, las cookies estrictamente necesarias no requieren el consentimiento previo del usuario, ya que son indispensables para el funcionamiento del sitio web.',
        ],
      },
      {
        title: '4. Gestión de cookies',
        paragraphs: [
          'Puedes configurar tu navegador para bloquear o eliminar cookies. No obstante, la desactivación de las cookies estrictamente necesarias puede impedir el correcto funcionamiento de algunas funcionalidades de este sitio web.',
        ],
      },
      {
        title: '5. Cambios en esta política',
        paragraphs: [
          'Esta Política de Cookies podrá actualizarse periódicamente para reflejar cambios legales o técnicos. La versión más reciente estará siempre disponible en esta página.',
        ],
      },
      {
        title: '6. Contacto',
        paragraphs: [
          'Si tienes alguna pregunta sobre esta Política de Cookies, puedes contactarnos a través de:',
        ],
        emailLabel: 'Correo electrónico',
      },
    ],
  },
};

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cookie-policy.component.html',
  styleUrl: './cookie-policy.component.css',
})
export class CookiePolicyComponent {
  currentLocale: Locale = 'en';
  currentTranslations: Translation = translations.en;
  currentPolicy: PolicyContent = policyContent.en;
  readonly languageOptions: ReadonlyArray<{ code: Locale; flagSrc: string }> = [
    { code: 'en', flagSrc: 'assets/flags/en.svg' },
    { code: 'es', flagSrc: 'assets/flags/es.svg' },
    { code: 'pt', flagSrc: 'assets/flags/pt.svg' },
  ];
  private readonly languageStorageKey = 'app-language';
  private readonly languagePreferenceSourceKey = 'app-language-source';
  private readonly manualLanguagePreference = 'manual';
  private readonly fallbackLocale: Locale = 'en';

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const savedLocale = this.getSavedLocale();
    this.applyLanguage(this.getInitialLocale(savedLocale));
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

  private applyLanguage(locale: Locale): void {
    this.currentLocale = locale;
    this.currentTranslations = translations[locale];
    this.currentPolicy = policyContent[locale];
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
}

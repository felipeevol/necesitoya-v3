import enTranslations from '../../assets/i18n/en.json';
import esTranslations from '../../assets/i18n/es.json';
import ptTranslations from '../../assets/i18n/pt.json';

export const translations = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

export type Locale = keyof typeof translations;
export type Translation = (typeof translations)[Locale];

export const languageOptions: ReadonlyArray<{ code: Locale; flagSrc: string }> = [
  { code: 'en', flagSrc: 'assets/flags/en.svg' },
  { code: 'es', flagSrc: 'assets/flags/es.svg' },
  { code: 'pt', flagSrc: 'assets/flags/pt.svg' },
];

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import km from './locales/km.json';

const STORAGE_KEY = 'hrms-language';

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'km') return stored;
  return navigator.language?.startsWith('km') ? 'km' : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Keep <html lang="..."> in sync (accessibility + font-selection hooks)
document.documentElement.setAttribute('lang', i18n.language);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.setAttribute('lang', lng);
});

export default i18n;
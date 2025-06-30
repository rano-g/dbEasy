import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { supportedLanguages } from './languages';

// Get language codes for i18n configuration
const supportedLngs = supportedLanguages.map(lang => lang.code);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    supportedLngs,
    
    // Namespace configuration
    ns: ['common'],
    defaultNS: 'common',
    
    // Backend configuration for loading translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.json'
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'preferred-language',
      caches: ['localStorage'],
      checkWhitelist: true
    },
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      }
    },
    
    // React configuration
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em']
    },
    
    // Debug in development
    debug: process.env.NODE_ENV === 'development',
    
    // Loading options
    load: 'languageOnly',
    preload: ['en', 'hi'], // Preload English and Hindi
    
    // Fallback options for missing translations
    saveMissing: false,
    updateMissing: false,
    
    // Advanced options
    cleanCode: true,
    nonExplicitSupportedLngs: true,
    
    // Custom resource loading for better performance
    resources: {
      en: {
        common: require('../locales/en/common.json')
      },
      hi: {
        common: require('../locales/hi/common.json')
      }
      // Other languages will be loaded on demand
    }
  });

// Language change handler for voice assistant
i18n.on('languageChanged', (lng) => {
  // Update document language attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    
    // Update font family based on language
    const language = supportedLanguages.find(lang => lang.code === lng);
    if (language?.fontFamily) {
      document.documentElement.style.fontFamily = language.fontFamily;
    }
    
    // Update text direction if needed
    document.documentElement.dir = language?.rtl ? 'rtl' : 'ltr';
  }
  
  // Save language preference
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('preferred-language', lng);
  }
  
  console.log(`Language changed to: ${lng}`);
});

// Error handling
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed to load ${lng}/${ns}:`, msg);
});

// Loading state handling
i18n.on('loaded', (loaded) => {
  console.log('i18n resources loaded:', Object.keys(loaded));
});

export default i18n;
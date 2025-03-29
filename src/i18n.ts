import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// RTL languages
export const RTL_LANGUAGES = ["ar", "fa", "he", "ur"];

i18n
  // Load translations from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar", "fa"],
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already safes from XSS
    },

    // Handling RTL for Arabic and Farsi
    react: {
      useSuspense: true,
    },

    // Backend configuration
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // Default namespace
    defaultNS: "common",
  });

// Function to check if a language is RTL
export const isRTL = (language: string) => {
  return RTL_LANGUAGES.includes(language);
};

export default i18n;

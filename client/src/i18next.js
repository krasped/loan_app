import i18n from 'i18next';
import Backend from "i18next-http-backend";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    whitelist: ["en", "ru"],
    debug: false,
    detection: {
        order: ["localStorage", "cookie"],
        caches: ["localStorage", "cookie"]
      },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
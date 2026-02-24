'use client'

import { useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations directly
import en from '../i18n/en.json'
import ar from '../i18n/ar.json'

if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
      fallbackLng: 'en',
      supportedLngs: ['en', 'ar'],
      interpolation: { escapeValue: false },
      detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie', 'localStorage'],
      },
    })
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lang = i18next.language
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}

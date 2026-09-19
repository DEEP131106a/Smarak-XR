import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

type LanguageCode = keyof typeof translations;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    // Add hidden div for Google Translate
    if (!document.getElementById('google_translate_element')) {
      const gtDiv = document.createElement('div');
      gtDiv.id = 'google_translate_element';
      document.body.appendChild(gtDiv);
    }

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };

    // Load script
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const addScript = document.createElement('script');
      addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (lang in translations) {
      setLanguageState(lang as LanguageCode);
      
      // Trigger Google Translate change
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    }
  };

  const t = (key: string): string => {
    const keys = translations[language];
    const val = keys ? (keys as any)[key] : undefined;
    if (!val) {
      console.warn(`Missing translation for key: ${key} in lang: ${language}`);
      return key;
    }
    return val;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

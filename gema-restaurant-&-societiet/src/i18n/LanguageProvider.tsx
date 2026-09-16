import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, t } from './translations';
import { LocalizedText } from '../data/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  l: (localizedText: LocalizedText) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('gema-language') as Language;
    if (saved && (saved === 'en' || saved === 'id')) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gema-language', lang);
    document.documentElement.lang = lang;
  };

  const translate = (key: string): string => {
    return t[language][key] || key;
  };

  const getLocalized = (localizedText: LocalizedText): string => {
    return localizedText[language] || localizedText.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate, l: getLocalized }}>
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

// Helper for formatting dates
export const formatDate = (dateString: string, language: Language) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Helper for formatting times
export const formatTime = (dateString: string, language: Language) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: language === 'en'
  }).format(date);
};

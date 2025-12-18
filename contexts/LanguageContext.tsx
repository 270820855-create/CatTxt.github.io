import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'hao_mao_lang';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to 'zh-CN'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return (saved as Language) || 'zh-CN';
  });

  // Persist language change
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, language);
  }, [language]);

  const t = (key: keyof typeof translations['en'], params?: { [key: string]: string | number }) => {
    let text = translations[language][key] || translations['en'][key];
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
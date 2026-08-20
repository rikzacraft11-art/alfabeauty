"use client";

import * as React from "react";
import { type Language, type Dictionary, getDictionary } from "@/shared/lib/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dict: Dictionary;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "alfa_beauty_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("id");

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "id" || saved === "en") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = "id";
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setLanguage = React.useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignore
    }
  }, []);

  const toggleLanguage = React.useCallback(() => {
    setLanguage(language === "id" ? "en" : "id");
  }, [language, setLanguage]);

  const dict = React.useMemo(() => getDictionary(language), [language]);

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      dict,
    }),
    [language, setLanguage, toggleLanguage, dict]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = React.useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "id",
      setLanguage: () => {},
      toggleLanguage: () => {},
      dict: getDictionary("id"),
    };
  }
  return context;
}

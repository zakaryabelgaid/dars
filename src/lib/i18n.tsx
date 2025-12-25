'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language } from './translations';

type I18nContextType = {
    lang: Language;
    setLang: (lang: Language) => void;
    t: typeof translations['en'];
    isRTL: boolean;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>('ar');

    useEffect(() => {
        const savedLang = localStorage.getItem('lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            setLang(savedLang);
        }
    }, []);

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    const isRTL = lang === 'ar';

    return (
        <I18nContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang], isRTL }}>
            <div dir={isRTL ? 'rtl' : 'ltr'} className={lang === 'ar' ? 'font-arabic' : 'font-sans'}>
                {children}
            </div>
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

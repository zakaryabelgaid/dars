'use client';

import { useI18n } from '@/lib/i18n';
import { Button } from './ui/Button';
import { Languages } from 'lucide-react';

export const LanguageToggle = () => {
    const { lang, setLang } = useI18n();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2"
        >
            <Languages size={18} />
            <span className="font-medium">{lang === 'en' ? 'العربية' : 'English'}</span>
        </Button>
    );
};

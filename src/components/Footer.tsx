'use client';

import { useI18n } from '@/lib/i18n';

export const Footer = () => {
    const { t, isRTL } = useI18n();

    return (
        <footer className="bg-white border-t border-primary/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-2">
                            {t.appName} <span className="text-secondary font-arabic">{t.appArabicName}</span>
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {t.footerDesc}
                        </p>
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left md:text-right'}>
                        <p className="text-sm text-muted-foreground italic mb-2">
                            {t.footerQuote}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t.footerCopyright.replace('{year}', new Date().getFullYear().toString())}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

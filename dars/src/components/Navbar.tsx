'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from './LanguageToggle';

export const Navbar = () => {
    const { t } = useI18n();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-primary rounded-lg text-white group-hover:bg-secondary transition-colors">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-xl font-bold text-primary">
                            {t.appName} <span className="text-secondary font-arabic">{t.appArabicName}</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden sm:flex items-center gap-6">
                            <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Admin
                            </Link>
                            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                {t.browseLessons}
                            </Link>
                            <Link href="/#filters" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                {t.search}
                            </Link>
                        </div>
                        <LanguageToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

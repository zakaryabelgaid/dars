'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Menu, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from './LanguageToggle';

export const Navbar = () => {
    const { t } = useI18n();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 group z-50">
                        <div className="p-1.5 bg-primary rounded-lg text-white group-hover:bg-secondary transition-colors">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-xl font-bold text-primary">
                            {t.appName} <span className="text-secondary font-arabic">{t.appArabicName}</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-6">
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

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <LanguageToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors z-50"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-16 bg-white z-40 md:hidden animate-in slide-in-from-top-5 fade-in duration-200 border-t border-primary/5">
                    <div className="p-4 space-y-4 flex flex-col items-center pt-8">
                        <Link
                            href="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center p-4 rounded-xl hover:bg-primary/5 text-lg font-medium text-secondary transition-colors"
                        >
                            Admin Panel
                        </Link>
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center p-4 rounded-xl hover:bg-primary/5 text-lg font-medium text-slate-700 transition-colors"
                        >
                            {t.browseLessons}
                        </Link>
                        <Link
                            href="/#filters"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center p-4 rounded-xl hover:bg-primary/5 text-lg font-medium text-slate-700 transition-colors"
                        >
                            {t.search}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

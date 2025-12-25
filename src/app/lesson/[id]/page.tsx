'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { type Lesson, type Mosque } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    User,
    Calendar,
    Clock,
    RotateCcw,
    BookOpen,
    Info,
    CalendarDays,
    ListOrdered,
    CheckCircle2,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function LessonDetail() {
    const { t, lang } = useI18n();
    const isRTL = lang === 'ar';
    const { id } = useParams();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [mosque, setMosque] = useState<Mosque | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchLesson();
        }
    }, [id]);

    const fetchLesson = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setLesson(data);

            if (data.mosque_id) {
                const { data: mData } = await supabase
                    .from('mosques')
                    .select('*')
                    .eq('id', data.mosque_id)
                    .single();
                if (mData) setMosque(mData);
            }
        } catch (err: any) {
            console.error('Error fetching lesson:', err.message);
            setError('Lesson not found or error loading details.');
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = () => {
        if (!lesson?.start_date || !lesson?.total_lessons) return null;

        const start = new Date(lesson.start_date);
        const now = new Date();

        if (now < start) return 0;

        const diffTime = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let completed = 0;
        const freq = lesson.frequency;

        if (freq === 'يومياً') {
            completed = diffDays + 1;
        } else if (freq === 'أسبوعياً') {
            completed = Math.floor(diffDays / 7) + 1;
        } else if (freq === 'مرتين في الأسبوع') {
            completed = Math.floor(diffDays / 3.5) + 1;
        } else if (freq === 'شهرياً') {
            completed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
        } else {
            completed = 1;
        }

        return Math.min(Math.max(0, completed), lesson.total_lessons);
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <Skeleton className="h-10 w-24 mb-8" />
                <Card className="p-8 space-y-6">
                    <Skeleton className="h-12 w-3/4" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                    <Skeleton className="h-32 w-full" />
                </Card>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">{t.noLessonsFound}</h2>
                <p className="text-muted-foreground mb-8">{t.tryAdjustingFilters}</p>
                <Link href="/">
                    <Button>{t.backToHome}</Button>
                </Link>
            </div>
        );
    }

    const completedCount = calculateProgress();
    const percent = completedCount !== null && lesson.total_lessons
        ? (completedCount / lesson.total_lessons) * 100
        : 0;
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;
    const mapsUrl = mosque?.location_url || `https://www.google.com/maps/search/${encodeURIComponent(lesson.mosque_name)}`;

    return (
        <main className="min-h-screen relative overflow-hidden bg-background">
            <div className="absolute inset-0 islamic-pattern pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-primary font-medium hover:underline mb-8 transition-all hover:-translate-x-1 rtl:hover:translate-x-1">
                    <BackIcon size={20} className={isRTL ? 'ml-2' : 'mr-2'} />
                    {t.backToLessons}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                                {lesson.title}
                            </h1>
                            {completedCount !== null && (
                                <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-5 min-w-[180px] shadow-sm">
                                    <div className="flex items-center gap-2 text-secondary mb-2 whitespace-nowrap">
                                        <TrendingUp size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{isRTL ? 'التقدم الحالي' : 'CURRENT PROGRESS'}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-3xl font-black text-secondary">{completedCount}/{lesson.total_lessons}</span>
                                        <span className="text-sm font-bold text-secondary/70">({Math.round(percent)}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden border border-secondary/10 shadow-inner">
                                        <div className="h-full bg-secondary" style={{ width: `${percent}%` }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full border border-primary/10">
                                <User size={18} />
                                <span className="font-semibold">{lesson.lecturer}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/5 text-secondary px-4 py-2 rounded-full border border-secondary/10">
                                <MapPin size={18} />
                                <span className="font-semibold">{lesson.mosque_name}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-primary/10 shadow-sm space-y-8 mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                                    <Info size={20} className="text-secondary" />
                                    {t.aboutLesson}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    {lesson.description || t.noDescription}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-muted">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.scheduleDay}</p>
                                            <p className="font-semibold">{lesson.day}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <RotateCcw size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.frequency}</p>
                                            <p className="font-semibold">{lesson.frequency}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <ListOrdered size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.totalLessons}</p>
                                            <p className="font-semibold">{lesson.total_lessons} {t.lessons}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.time}</p>
                                            <p className="font-semibold">{lesson.time_relation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <CalendarDays size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.coursePeriod}</p>
                                            <p className="font-semibold text-sm">
                                                {lesson.start_date} <br />
                                                <span className="text-muted-foreground px-1">→</span> <br />
                                                {lesson.end_date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary text-green-600">
                                            {percent === 100 ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.status}</p>
                                            <p className={`font-semibold ${percent === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                                                {percent === 100 ? (isRTL ? 'دورة مكتملة' : 'Completed Course') : t.activeGathering}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-8 overflow-hidden border-secondary/20 bg-secondary/5">
                            <div className="h-2 bg-secondary" />
                            <CardContent className="p-6">
                                <h4 className="font-bold text-primary mb-4">{t.interestedTitle}</h4>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {t.interestedDesc}
                                </p>
                                <Link href={mapsUrl} target="_blank">
                                    <Button className="w-full" variant="secondary">
                                        {t.getDirections}
                                    </Button>
                                </Link>
                                <p className="text-[10px] text-center mt-4 text-muted-foreground italic">
                                    {t.footerQuote}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}

import Link from 'next/link';
import { MapPin, User, Calendar, Clock, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { type Lesson } from '@/types';
import { useI18n } from '@/lib/i18n';

interface LessonCardProps {
    lesson: Lesson;
}

export const LessonCard = ({ lesson }: LessonCardProps) => {
    const { lang, t } = useI18n();
    const isRTL = lang === 'ar';

    const calculateProgress = () => {
        if (!lesson.start_date || !lesson.total_lessons) return null;

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

    const completedCount = calculateProgress();
    const percent = completedCount !== null && lesson.total_lessons
        ? (completedCount / lesson.total_lessons) * 100
        : 0;

    return (
        <Link href={`/lesson/${lesson.id}`}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-primary/10 flex flex-col hover:-translate-y-1">
                <CardHeader className="pb-2">
                    <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors leading-tight">
                        {lesson.title}
                    </h3>
                </CardHeader>

                <CardContent className="space-y-4 pb-4 flex-grow">
                    <div className="flex items-center text-muted-foreground gap-2.5">
                        <User size={18} className="text-primary/70" />
                        <span className="text-sm font-semibold text-slate-700">{lesson.lecturer}</span>
                    </div>

                    <div className="flex items-center text-muted-foreground gap-2.5">
                        <MapPin size={18} className="text-primary/70" />
                        <span className="text-sm text-slate-600 line-clamp-1">{lesson.mosque_name}</span>
                    </div>

                    {completedCount !== null && (
                        <div className="space-y-2 pt-1">
                            <div className="flex justify-between items-center text-[11px] font-black text-secondary uppercase tracking-tight">
                                <span>{isRTL ? 'التقدم' : 'Progress'}</span>
                                <span>{completedCount}/{lesson.total_lessons} ({Math.round(percent)}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-primary/5 shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-secondary to-secondary/70 transition-all duration-1000 ease-out"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5 mt-2">
                        <div className="flex items-center text-xs font-bold text-slate-500 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Calendar size={14} className="text-primary/70" />
                            <span>{lesson.day}</span>
                        </div>
                        <div className="flex items-center text-xs font-bold text-slate-500 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Clock size={14} className="text-primary/70" />
                            <span>{lesson.time_relation}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-0 flex items-center justify-between border-t border-primary/5 mt-auto bg-primary/[0.02] py-3 px-4 rounded-b-xl group-hover:bg-primary/[0.04] transition-colors">
                    <div className="flex items-center gap-2">
                        <RotateCcw size={14} className="text-secondary" />
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">{lesson.frequency}</span>
                    </div>
                    {percent === 100 && (
                        <div className="flex items-center gap-1.5 text-green-600 font-black">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] uppercase tracking-wider">{isRTL ? 'مكتمل' : 'Completed'}</span>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    );
};

'use client';

import { Search as SearchIcon } from 'lucide-react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { type LessonFilters } from '@/types';
import { useI18n } from '@/lib/i18n';

interface FilterBarProps {
    filters: LessonFilters;
    setFilters: (filters: LessonFilters) => void;
}

export const FilterBar = ({ filters, setFilters }: FilterBarProps) => {
    const { t, lang } = useI18n();
    const isRTL = lang === 'ar';

    const days = [
        { label: t.allDays, value: '' },
        { label: 'الأحد', value: 'الأحد' },
        { label: 'الاثنين', value: 'الاثنين' },
        { label: 'الثلاثاء', value: 'الثلاثاء' },
        { label: 'الأربعاء', value: 'الأربعاء' },
        { label: 'الخميس', value: 'الخميس' },
        { label: 'الجمعة', value: 'الجمعة' },
        { label: 'السبت', value: 'السبت' },
    ];

    const times = [
        { label: t.allTimes, value: '' },
        { label: 'بعد الفجر', value: 'بعد الفجر' },
        { label: 'قبل الظهر', value: 'قبل الظهر' },
        { label: 'بعد الظهر', value: 'بعد الظهر' },
        { label: 'قبل العصر', value: 'قبل العصر' },
        { label: 'بعد العصر', value: 'بعد العصر' },
        { label: 'قبل المغرب', value: 'قبل المغرب' },
        { label: 'بعد المغرب', value: 'بعد المغرب' },
        { label: 'قبل العشاء', value: 'قبل العشاء' },
        { label: 'بعد العشاء', value: 'بعد العشاء' },
    ];

    const frequencies = [
        { label: t.allFrequencies, value: '' },
        { label: 'أسبوعياً', value: 'أسبوعياً' },
        { label: 'يومياً', value: 'يومياً' },
        { label: 'شهرياً', value: 'شهرياً' },
        { label: 'مرتين في الأسبوع', value: 'مرتين في الأسبوع' },
    ];

    return (
        <div className="space-y-4 bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="relative">
                <SearchIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
                <Input
                    placeholder={t.searchPlaceholder}
                    className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 text-base`}
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    options={days}
                    value={filters.day || ''}
                    onChange={(e) => setFilters({ ...filters, day: e.target.value })}
                />
                <Select
                    options={times}
                    value={filters.time_relation || ''}
                    onChange={(e) => setFilters({ ...filters, time_relation: e.target.value })}
                />
                <Select
                    options={frequencies}
                    value={filters.frequency || ''}
                    onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
                />
            </div>
        </div>
    );
};

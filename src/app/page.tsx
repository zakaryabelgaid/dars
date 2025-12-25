'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { type Lesson, type LessonFilters } from '@/types';
import { FilterBar } from '@/components/FilterBar';
import { LessonCard } from '@/components/LessonCard';
import { LessonCardSkeleton } from '@/components/ui/Skeleton';
import { Search, BookOpen, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t, lang } = useI18n();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LessonFilters>({
    search: '',
    day: '',
    time_relation: '',
    frequency: '',
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, lessons]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLessons(data || []);
    } catch (err: any) {
      console.error('Error fetching lessons:', err.message);
      setError(err.message || 'Could not load lessons. Please make sure Supabase is configured.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...lessons];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(searchLower) ||
          l.lecturer?.toLowerCase().includes(searchLower) ||
          l.mosque_name?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.day) {
      result = result.filter((l) => l.day === filters.day);
    }

    if (filters.time_relation) {
      result = result.filter((l) => l.time_relation === filters.time_relation);
    }

    if (filters.frequency) {
      result = result.filter((l) => l.frequency === filters.frequency);
    }

    setFilteredLessons(result);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
            <BookOpen size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />
            {t.heroTag}
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
            {t.heroTitle} <span className="text-secondary">{t.appArabicName}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t.heroDescription}
          </p>
        </div>

        {/* Search & Filters */}
        <div id="filters" className="max-w-4xl mx-auto mb-12">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LessonCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm animate-in fade-in zoom-in duration-300">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Configuration Required</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
            <div className="bg-red-50 p-4 rounded-lg inline-block text-sm text-red-800 border border-red-100">
              Please setup your <strong>.env.local</strong> with Supabase keys.
            </div>
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-primary/20">
            <Search size={48} className="mx-auto text-primary/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">{t.noLessonsFound}</h3>
            <p className="text-muted-foreground">{t.tryAdjustingFilters}</p>
          </div>
        )}
      </div>
    </main>
  );
}

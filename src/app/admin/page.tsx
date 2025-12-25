'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { type Lesson, type Mosque } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, Pencil, Trash2, MapPin, Search, ArrowLeft, Loader2, User, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function AdminPage() {
    const { t, lang } = useI18n();
    const isRTL = lang === 'ar';
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'lessons' | 'mosques'>('lessons');

    // Form States
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        lecturer: '',
        mosque_id: '',
        day: '',
        time_relation: '',
        frequency: '',
        total_lessons: 1,
        start_date: '',
        end_date: '',
        description: '',
    });

    const [editingMosqueId, setEditingMosqueId] = useState<string | null>(null);
    const [mosqueForm, setMosqueForm] = useState({
        name: '',
        location_url: '',
    });

    const timingOptions = [
        { label: t.time, value: '' },
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

    const frequencyOptions = [
        { label: t.frequency, value: '' },
        { label: 'أسبوعياً', value: 'أسبوعياً' },
        { label: 'يومياً', value: 'يومياً' },
        { label: 'شهرياً', value: 'شهرياً' },
        { label: 'مرتين في الأسبوع', value: 'مرتين في الأسبوع' },
    ];

    const dayOptions = [
        { label: t.scheduleDay, value: '' },
        { label: 'الأحد', value: 'الأحد' },
        { label: 'الاثنين', value: 'الاثنين' },
        { label: 'الثلاثاء', value: 'الثلاثاء' },
        { label: 'الأربعاء', value: 'الأربعاء' },
        { label: 'الخميس', value: 'الخميس' },
        { label: 'الجمعة', value: 'الجمعة' },
        { label: 'السبت', value: 'السبت' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate End Date
    useEffect(() => {
        if (lessonForm.start_date && lessonForm.total_lessons > 0 && lessonForm.frequency) {
            const start = new Date(lessonForm.start_date);
            let end = new Date(start);
            const total = lessonForm.total_lessons;

            if (lessonForm.frequency === 'أسبوعياً') {
                end.setDate(start.getDate() + (total - 1) * 7);
            } else if (lessonForm.frequency === 'يومياً') {
                end.setDate(start.getDate() + (total - 1));
            } else if (lessonForm.frequency === 'شهرياً') {
                end.setMonth(start.getMonth() + (total - 1));
            } else if (lessonForm.frequency === 'مرتين في الأسبوع') {
                end.setDate(start.getDate() + Math.ceil((total - 1) / 2) * 7);
            }

            const endStr = end.toISOString().split('T')[0];
            if (lessonForm.end_date !== endStr) {
                setLessonForm(prev => ({ ...prev, end_date: endStr }));
            }
        }
    }, [lessonForm.start_date, lessonForm.total_lessons, lessonForm.frequency]);

    const fetchData = async () => {
        setLoading(true);
        const [lessonsRes, mosquesRes] = await Promise.all([
            supabase.from('lessons').select('*').order('created_at', { ascending: false }),
            supabase.from('mosques').select('*').order('name', { ascending: true }),
        ]);

        if (lessonsRes.data) setLessons(lessonsRes.data);
        if (mosquesRes.data) setMosques(mosquesRes.data);
        setLoading(false);
    };

    const handleLessonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const selectedMosque = mosques.find(m => m.id === lessonForm.mosque_id);
        const payload = {
            ...lessonForm,
            mosque_name: selectedMosque?.name || '',
        };

        if (editingLessonId) {
            await supabase.from('lessons').update(payload).eq('id', editingLessonId);
        } else {
            await supabase.from('lessons').insert([payload]);
        }

        setEditingLessonId(null);
        setLessonForm({
            title: '', lecturer: '', mosque_id: '', day: '',
            time_relation: '', frequency: '', total_lessons: 1,
            start_date: '', end_date: '', description: ''
        });
        fetchData();
        setSubmitting(false);
    };

    const handleMosqueSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        if (editingMosqueId) {
            await supabase.from('mosques').update(mosqueForm).eq('id', editingMosqueId);
        } else {
            await supabase.from('mosques').insert([mosqueForm]);
        }

        setEditingMosqueId(null);
        setMosqueForm({ name: '', location_url: '' });
        fetchData();
        setSubmitting(false);
    };

    const deleteLesson = async (id: string) => {
        if (confirm(t.deleteConfirmLesson)) {
            await supabase.from('lessons').delete().eq('id', id);
            fetchData();
        }
    };

    const deleteMosque = async (id: string) => {
        if (confirm(t.deleteConfirmMosque)) {
            await supabase.from('mosques').delete().eq('id', id);
            fetchData();
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <div className="bg-white border-b border-primary/10 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft size={18} className={isRTL ? 'ml-2' : 'mr-2'} /> {t.viewSite}
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-primary">{t.adminPanel}</h1>
                    </div>
                    <div className="flex bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('lessons')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'lessons' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
                        >
                            {t.lessons}
                        </button>
                        <button
                            onClick={() => setActiveTab('mosques')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'mosques' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
                        >
                            {t.mosques}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-primary/10 shadow-md">
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg flex items-center gap-2">
                                {activeTab === 'lessons'
                                    ? (editingLessonId ? t.editLesson : t.addLesson)
                                    : (editingMosqueId ? t.editMosque : t.addMosque)
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {activeTab === 'lessons' ? (
                                <form onSubmit={handleLessonSubmit} className="space-y-4">
                                    <Input
                                        placeholder={`${t.heroTitle} (Arabic)`}
                                        value={lessonForm.title}
                                        onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder={`${t.lecturer} (Arabic)`}
                                        value={lessonForm.lecturer}
                                        onChange={e => setLessonForm({ ...lessonForm, lecturer: e.target.value })}
                                        required
                                    />
                                    <Select
                                        options={[
                                            { label: t.mosque, value: '' },
                                            ...mosques.map(m => ({ label: m.name, value: m.id }))
                                        ]}
                                        value={lessonForm.mosque_id}
                                        onChange={e => setLessonForm({ ...lessonForm, mosque_id: e.target.value })}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            options={dayOptions}
                                            value={lessonForm.day}
                                            onChange={e => setLessonForm({ ...lessonForm, day: e.target.value })}
                                            required
                                        />
                                        <Select
                                            options={timingOptions}
                                            value={lessonForm.time_relation}
                                            onChange={e => setLessonForm({ ...lessonForm, time_relation: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            options={frequencyOptions}
                                            value={lessonForm.frequency}
                                            onChange={e => setLessonForm({ ...lessonForm, frequency: e.target.value })}
                                            required
                                        />
                                        <Input
                                            type="number"
                                            placeholder={t.totalLessons}
                                            value={lessonForm.total_lessons}
                                            onChange={e => setLessonForm({ ...lessonForm, total_lessons: parseInt(e.target.value) || 0 })}
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t.startDate}</label>
                                            <Input
                                                type="date"
                                                value={lessonForm.start_date}
                                                onChange={e => setLessonForm({ ...lessonForm, start_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{t.endDate}</label>
                                            <Input
                                                type="date"
                                                value={lessonForm.end_date}
                                                disabled
                                                className="bg-muted/50"
                                            />
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
                                        placeholder={`${t.aboutLesson} (Arabic)`}
                                        value={lessonForm.description}
                                        onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" className="flex-1" disabled={submitting}>
                                            {submitting ? t.saving : (editingLessonId ? t.updateLesson : t.saveLesson)}
                                        </Button>
                                        {editingLessonId && (
                                            <Button variant="outline" type="button" onClick={() => {
                                                setEditingLessonId(null);
                                                setLessonForm({ title: '', lecturer: '', mosque_id: '', day: '', time_relation: '', frequency: '', total_lessons: 1, start_date: '', end_date: '', description: '' });
                                            }}>{t.cancel}</Button>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleMosqueSubmit} className="space-y-4">
                                    <Input
                                        placeholder={`${t.mosque} (Arabic)`}
                                        value={mosqueForm.name}
                                        onChange={e => setMosqueForm({ ...mosqueForm, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Google Maps URL"
                                        value={mosqueForm.location_url}
                                        onChange={e => setMosqueForm({ ...mosqueForm, location_url: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" className="flex-1" disabled={submitting}>
                                            {submitting ? t.saving : (editingMosqueId ? t.updateMosque : t.saveMosque)}
                                        </Button>
                                        {editingMosqueId && (
                                            <Button variant="outline" type="button" onClick={() => {
                                                setEditingMosqueId(null);
                                                setMosqueForm({ name: '', location_url: '' });
                                            }}>{t.cancel}</Button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-slate-800">
                            {activeTab === 'lessons' ? t.existingLessons : t.existingMosques}
                        </h2>
                        <div className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border">
                            {t.totalLessons}: {activeTab === 'lessons' ? lessons.length : mosques.length}
                        </div>
                    </div>

                    {activeTab === 'lessons' ? (
                        <div className="space-y-4">
                            {lessons.map(lesson => (
                                <div key={lesson.id} className="bg-white p-4 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div>
                                                <h3 className="font-bold text-primary flex items-center gap-2">
                                                    {lesson.title}
                                                    <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{lesson.frequency}</span>
                                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{lesson.total_lessons} {t.lessons}</span>
                                                </h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                        <User size={14} className="text-secondary" /> {lesson.lecturer}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-secondary" /> {lesson.mosque_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                                <p className="flex items-center gap-1.5">
                                                    <CalendarIcon size={12} /> {lesson.start_date || '...'} → {lesson.end_date || '...'}
                                                </p>
                                                <p className="flex items-center gap-1.5">
                                                    <Clock size={12} /> {lesson.day} - {lesson.time_relation}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 transition-opacity">
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setEditingLessonId(lesson.id);
                                                setLessonForm({
                                                    title: lesson.title,
                                                    lecturer: lesson.lecturer,
                                                    mosque_id: lesson.mosque_id || '',
                                                    day: lesson.day,
                                                    time_relation: lesson.time_relation,
                                                    frequency: lesson.frequency,
                                                    total_lessons: lesson.total_lessons || 1,
                                                    start_date: lesson.start_date || '',
                                                    end_date: lesson.end_date || '',
                                                    description: lesson.description || '',
                                                });
                                            }}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteLesson(lesson.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mosques.map(mosque => (
                                <div key={mosque.id} className="bg-white p-4 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-primary">{mosque.name}</h3>
                                            {mosque.location_url && (
                                                <a href={mosque.location_url} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                    <MapPin size={12} /> {t.getDirections}
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex gap-1 transition-opacity">
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setEditingMosqueId(mosque.id);
                                                setMosqueForm({
                                                    name: mosque.name,
                                                    location_url: mosque.location_url || '',
                                                });
                                            }}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteMosque(mosque.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

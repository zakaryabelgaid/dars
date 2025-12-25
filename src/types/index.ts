export type Mosque = {
    id: string;
    name: string;
    location_url: string;
    created_at: string;
};

export type Lesson = {
    id: string;
    title: string;
    lecturer: string;
    mosque_id: string;
    mosque_name: string;
    day: string;
    time_relation: string;
    frequency: string;
    total_lessons: number;
    start_date: string;
    end_date: string;
    description?: string;
    created_at: string;
};

export type LessonFilters = {
    search?: string;
    day?: string;
    time_relation?: string;
    frequency?: string;
};

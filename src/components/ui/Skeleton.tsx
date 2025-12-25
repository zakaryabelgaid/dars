import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

export function LessonCardSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="flex gap-1.5 pt-2">
                <Skeleton className="h-3 w-1/4" />
            </div>
        </div>
    );
}

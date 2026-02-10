import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-12 w-64 md:w-96 rounded-2xl" />
                </div>
                <Skeleton className="h-12 w-full md:w-80 rounded-full" />
            </div>

            {/* Banner Skeleton */}
            <Skeleton className="w-full h-48 rounded-2xl mb-12" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border border-stone-100 rounded-2xl p-6 bg-white space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-14 h-14 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32 rounded-lg" />
                                <Skeleton className="h-4 w-16 rounded-full" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-20 rounded-md" />
                        </div>
                        <div className="pt-4 border-t border-stone-50 flex justify-between">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-4 w-16 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

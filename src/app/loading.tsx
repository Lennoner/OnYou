import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="w-full h-full p-6 md:p-10 max-w-[1400px] mx-auto">
            {/* Header Skeleton */}
            <div className="mb-10 flex justify-between items-end">
                <div className="space-y-3">
                    <Skeleton className="h-12 w-64 md:w-96 rounded-2xl" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
                <div className="hidden md:block">
                    <Skeleton className="h-6 w-32 mb-2 rounded-full ml-auto" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Priority Card */}
                <Skeleton className="md:col-span-2 h-[300px] rounded-3xl" />

                {/* Side Card 1 */}
                <Skeleton className="h-[300px] rounded-3xl" />

                {/* Side Card 2 */}
                <Skeleton className="h-[200px] rounded-3xl" />

                {/* Bottom Card */}
                <Skeleton className="md:col-span-2 h-[200px] rounded-3xl" />
            </div>
        </div>
    );
}

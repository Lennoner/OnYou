import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-[#FAFAF9]">
            {/* Left Panel Skeleton */}
            <div className="w-full md:w-[400px] lg:w-[480px] p-6 md:p-10 flex flex-col gap-8 border-r border-stone-200">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>

                <div className="flex-1 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24 rounded-full" />
                                <Skeleton className="h-4 w-12 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel Skeleton (Editor) */}
            <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center bg-stone-100">
                <div className="w-full max-w-2xl bg-white p-12 rounded-xl shadow-sm space-y-8 aspect-[3/4]">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-32 rounded-lg" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-5/6 rounded" />
                    </div>
                    <div className="pt-20 space-y-2">
                        <Skeleton className="h-4 w-32 ml-auto rounded" />
                        <Skeleton className="h-4 w-40 ml-auto rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

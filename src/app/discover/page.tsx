"use client";

import React, { useState } from "react";
import { SelfSurvey } from "@/components/discover/SelfSurvey";
import { AnalysisResult } from "@/components/discover/AnalysisResult";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

type DiscoverMode = "report" | "survey";

export default function DiscoverPage() {
    const { data: session } = useSession();
    const [mode, setMode] = useState<DiscoverMode>("survey");
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const checkSurvey = async () => {
            try {
                const res = await fetch('/api/discover');
                if (res.ok) {
                    const data = await res.json();
                    if (data.exists) {
                        setAnalysisData({
                            radarData: data.radarData,
                            answers: data.answers
                        });
                        setMode("report");
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        checkSurvey();
    }, []);

    if (isLoading) {
        return (
            <div className="h-full bg-stone-50 p-6 md:p-10 max-w-4xl mx-auto">
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-stone-200 rounded-full animate-pulse" />
                            <div className="h-8 w-48 bg-stone-200 rounded-lg animate-pulse" />
                        </div>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full animate-pulse" />
                    <div className="h-[400px] bg-white rounded-3xl border border-stone-200 p-8 space-y-8 animate-pulse">
                        <div className="h-8 w-3/4 bg-stone-100 rounded-lg" />
                        <div className="space-y-4">
                            <div className="h-12 w-full bg-stone-100 rounded-xl" />
                            <div className="h-12 w-full bg-stone-100 rounded-xl" />
                            <div className="h-12 w-full bg-stone-100 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full relative bg-stone-50">
            <AnimatePresence mode="wait">
                {mode === "survey" ? (
                    <motion.div
                        key="survey"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full overflow-y-auto"
                    >
                        <SelfSurvey onComplete={(radarResult) => {
                            // Reload to fetch full data including answers
                            window.location.reload();
                        }} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="report"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full overflow-y-auto scrollbar-hide"
                    >
                        <AnalysisResult
                            onRetake={() => setMode("survey")}
                            data={analysisData}
                            userName={session?.user?.name || undefined}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

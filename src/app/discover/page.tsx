"use client";

import React, { useState } from "react";
import { SelfSurvey } from "@/components/discover/SelfSurvey";
import { AnalysisResult } from "@/components/discover/AnalysisResult";
import { motion, AnimatePresence } from "framer-motion";
import type { AnalysisData } from "@/types";

type DiscoverMode = "report" | "survey";

export default function DiscoverPage() {
    const [mode, setMode] = useState<DiscoverMode>("survey");
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkSurvey = React.useCallback(async () => {
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
    }, []);

    React.useEffect(() => {
        checkSurvey();
    }, [checkSurvey]);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-stone-50">
                <span className="loading loading-spinner text-stone-300">Loading...</span>
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
                        <SelfSurvey onComplete={async (radarResult) => {
                            // Fetch updated data after survey completion
                            await checkSurvey();
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
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

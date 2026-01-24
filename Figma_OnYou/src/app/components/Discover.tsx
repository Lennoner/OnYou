import React, { useState } from "react";
import { SelfSurvey } from "./SelfSurvey";
import { AnalysisResult } from "./AnalysisResult";
import { motion, AnimatePresence } from "motion/react";

type DiscoverMode = "report" | "survey";

export function Discover() {
  // In a real app, we would check if the user has completed the survey.
  // Defaulting to "report" as per instructions implying the survey is already done.
  const [mode, setMode] = useState<DiscoverMode>("report");

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
            <SelfSurvey onComplete={() => setMode("report")} />
          </motion.div>
        ) : (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full overflow-y-auto scrollbar-hide"
          >
            <AnalysisResult onRetake={() => setMode("survey")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

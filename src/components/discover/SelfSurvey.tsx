"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { selfSurveyQuestions as questions, type Section } from "@/constants/survey-questions";

interface SelfSurveyProps {
    onComplete?: (data?: any) => void;
}

export function SelfSurvey({ onComplete }: SelfSurveyProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resultData, setResultData] = useState<any>(null);

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleNext = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Submit Data
            if (isSubmitting) return;
            setIsSubmitting(true);
            try {
                const res = await fetch('/api/discover', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers })
                });
                if (!res.ok) throw new Error("Failed to save survey");
                const data = await res.json();
                setResultData(data.radarData);
                setIsCompleted(true);
            } catch (e) {
                console.error(e);
                toast.error("설문 저장에 실패했습니다. 다시 시도해주세요.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const updateAnswer = (value: any) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));

        // Auto-advance for SCALE type
        if (currentQuestion.type === "SCALE" && currentStep < questions.length - 1) {
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 300); // Small delay for visual feedback
        }
    };

    const updateMultipleChoice = (option: string) => {
        const current = answers[currentQuestion.id] || [];
        const updated = current.includes(option)
            ? current.filter((item: string) => item !== option)
            : [...current, option];
        updateAnswer(updated);
    };

    const isCurrentStepValid = () => {
        const answer = answers[currentQuestion.id];
        if (currentQuestion.type === "MULTIPLE_CHOICE") {
            return answer && answer.length > 0;
        }
        return answer !== undefined && answer !== "";
    };

    const getSectionIcon = (section: Section) => {
        switch (section) {
            case "BASIC": return "📈";
            case "PAST": return "🕰️";
            case "PRESENT": return "📅";
            case "FUTURE": return "🚀";
        }
    };

    const getSectionLabel = (section: Section) => {
        switch (section) {
            case "BASIC": return "기본 질문";
            case "PAST": return "과거의 나";
            case "PRESENT": return "현재의 나";
            case "FUTURE": return "미래의 나";
        }
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6 bg-stone-50 rounded-3xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-6 text-4xl"
                >
                    ✨
                </motion.div>
                <h2 className="text-3xl font-bold text-stone-900 mb-3">설문이 완료되었습니다!</h2>
                <p className="text-stone-500 max-w-md mb-8">
                    솔직한 이야기를 들려주셔서 감사합니다.<br />
                    이제 친구들에게 피드백을 요청하여<br />
                    나의 새로운 가치를 발견해보세요.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsCompleted(false)}
                        className="px-6 py-3 border border-stone-200 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                        답변 수정하기
                    </button>
                    <button
                        onClick={() => onComplete && onComplete(resultData)}
                        className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 shadow-md shadow-amber-200 transition-all transform hover:-translate-y-1"
                    >
                        결과 분석 보러가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            {/* Header & Progress */}
            <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold mb-2">
                            <span>{getSectionIcon(currentQuestion.section)}</span>
                            {getSectionLabel(currentQuestion.section)}
                        </span>
                        <h2 className="text-xl font-bold text-stone-900">나의 이야기 기록하기</h2>
                    </div>
                    <span className="text-stone-400 font-mono text-sm">
                        {currentStep + 1} / {questions.length}
                    </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-stone-900 leading-snug mb-2">
                                {currentQuestion.text}
                            </h3>
                            {currentQuestion.subtext && (
                                <div className="flex items-start gap-2 text-stone-500 bg-stone-50 p-3 rounded-lg inline-block">
                                    <span className="mt-0.5 shrink-0 text-sm">💡</span>
                                    <p className="text-sm">{currentQuestion.subtext}</p>
                                </div>
                            )}
                        </div>

                        {/* Scale Input */}
                        {currentQuestion.type === "SCALE" && (
                            <div className="py-8">
                                <div className="flex justify-between mb-2 text-sm text-stone-500 font-medium">
                                    <span>{currentQuestion.scaleLabel?.min}</span>
                                    <span>{currentQuestion.scaleLabel?.max}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => updateAnswer(value)}
                                            className={cn(
                                                "flex-1 h-14 rounded-xl font-bold text-lg transition-all",
                                                answers[currentQuestion.id] === value
                                                    ? "bg-amber-500 text-white shadow-md transform -translate-y-1"
                                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                            )}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Multiple Choice Input */}
                        {currentQuestion.type === "MULTIPLE_CHOICE" && (
                            <div className="space-y-3">
                                {currentQuestion.options?.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => updateMultipleChoice(option)}
                                        className={cn(
                                            "w-full p-4 rounded-xl text-left font-medium transition-all flex items-center justify-between",
                                            (answers[currentQuestion.id] || []).includes(option)
                                                ? "bg-amber-50 text-amber-700 border-2 border-amber-500"
                                                : "bg-stone-50 text-stone-600 border-2 border-transparent hover:bg-stone-100"
                                        )}
                                    >
                                        {option}
                                        {(answers[currentQuestion.id] || []).includes(option) && (
                                            <span className="text-amber-500">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Text Input */}
                        {currentQuestion.type === "TEXT" && (
                            <textarea
                                value={answers[currentQuestion.id] || ""}
                                onChange={(e) => updateAnswer(e.target.value)}
                                placeholder={currentQuestion.placeholder}
                                className="w-full h-48 p-4 bg-stone-50 border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-stone-700 placeholder:text-stone-400 leading-relaxed"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors",
                        currentStep === 0
                            ? "text-stone-300 cursor-not-allowed"
                            : "text-stone-600 hover:bg-stone-100"
                    )}
                >
                    <span>←</span>
                    이전
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid() || isSubmitting}
                    className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg",
                        !isCurrentStepValid() || isSubmitting
                            ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                            : "bg-stone-900 text-white hover:bg-stone-800 hover:-translate-y-1 shadow-stone-200"
                    )}
                >
                    {isSubmitting ? "저장 중..." : currentStep === questions.length - 1 ? "완료하기" : "다음"}
                    {!isSubmitting && (currentStep === questions.length - 1 ? <span>✓</span> : <span>→</span>)}
                </button>
            </div>
        </div>
    );
}

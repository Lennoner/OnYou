"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles, Clock, Calendar, Rocket, Activity, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RadarDataItem, SurveyAnswers } from "@/types";

type Section = "BASIC" | "PAST" | "PRESENT" | "FUTURE";
type QuestionType = "SCALE" | "MULTIPLE_CHOICE" | "TEXT";

interface Question {
    id: string;
    section: Section;
    type: QuestionType;
    text: string;
    subtext?: string;
    options?: string[]; // For MULTIPLE_CHOICE
    scaleLabel?: { min: string; max: string }; // For SCALE
    placeholder?: string; // For TEXT
}

const questions: Question[] = [
    // Basic
    {
        id: "basic1",
        section: "BASIC",
        type: "SCALE",
        text: "요즘 전반적인 나의 심리적 상태는 어떤가요?",
        scaleLabel: { min: "무기력함", max: "활기참" }
    },
    // Past
    {
        id: "past1",
        section: "PAST",
        type: "SCALE",
        text: "나는 과거에 어려운 상황이나 난관을 결국 내 힘으로 극복해본 적이 있다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past2",
        section: "PAST",
        type: "SCALE",
        text: "나는 내가 거둔 성과나 결과물에 대해 충분히 자부심을 느낀다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past-select",
        section: "PAST",
        type: "MULTIPLE_CHOICE",
        text: "내가 얻은 긍정적인 결과들은 주로 무엇 덕분이라고 생각하나요?",
        subtext: "해당하는 것을 모두 선택해주세요.",
        options: ["운이나 좋은 타이밍", "주변 사람들의 도움", "나의 노력과 역량"]
    },
    {
        id: "past-text",
        section: "PAST",
        type: "TEXT",
        text: "내 삶에서 가장 에너지가 넘치던 순간은?",
        placeholder: "그때의 상황과 기분을 떠올려보세요."
    },
    // Present
    {
        id: "present1",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 현재 주변 사람들의 삶에 긍정적인 영향을 주고 있다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present2",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 내가 속한 그룹(친구, 팀, 직장 등)에서 꼭 필요한 사람이라고 느낀다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-select",
        section: "PRESENT",
        type: "SCALE",
        text: "나는 친구나 동료에게 특별한 존재라고 느낀다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-text",
        section: "PRESENT",
        type: "TEXT",
        text: "주변 사람들이 당신에게 고맙다고 말하거나 당신을 찾는 이유는?",
        subtext: "예: 고민 상담, 밥 같이 먹기, 기술적 도움, 분위기 메이커 등",
        placeholder: "구체적인 이유를 적어보세요."
    },
    // Future
    {
        id: "future1",
        section: "FUTURE",
        type: "SCALE",
        text: "나는 미래에 내가 원하는 분야에서 나만의 가치를 증명할 잠재력이 충분하다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future2",
        section: "FUTURE",
        type: "SCALE",
        text: "3년 뒤 나는 내가 원하는 방향으로 성장해 있을 것이다",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future-text",
        section: "FUTURE",
        type: "TEXT",
        text: "두려움 없이 도전하고 싶은 것은 무엇인가요?",
        subtext: "분야, 역할, 도전 등 자유롭게 적어주세요",
        placeholder: "가슴 뛰는 도전을 적어보세요."
    },
];

interface SelfSurveyProps {
    onComplete?: (data?: RadarDataItem[]) => void;
}

export function SelfSurvey({ onComplete }: SelfSurveyProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<SurveyAnswers>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [resultData, setResultData] = useState<RadarDataItem[] | null>(null);

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleNext = async () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Submit Data
            try {
                const res = await fetch('/api/discover', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers })
                });
                if (res.ok) {
                    const data = await res.json();
                    setResultData(data.radarData); // Store result
                    setIsCompleted(true);
                }
            } catch (e) {
                console.error(e);
                setIsCompleted(true); // Fallback to show completion screen even if save fails (for now)
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const updateAnswer = (value: string | number | string[]) => {
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
        const current = answers[currentQuestion.id];
        const currentArray = Array.isArray(current) ? current : [];
        const updated = currentArray.includes(option)
            ? currentArray.filter((item: string) => item !== option)
            : [...currentArray, option];
        updateAnswer(updated);
    };

    const isCurrentStepValid = () => {
        const answer = answers[currentQuestion.id];
        if (currentQuestion.type === "MULTIPLE_CHOICE") {
            return Array.isArray(answer) && answer.length > 0;
        }
        return answer !== undefined && answer !== "";
    };

    const getSectionIcon = (section: Section) => {
        switch (section) {
            case "BASIC": return <Activity size={18} />;
            case "PAST": return <Clock size={18} />;
            case "PRESENT": return <Calendar size={18} />;
            case "FUTURE": return <Rocket size={18} />;
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
                    className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-6"
                >
                    <Sparkles size={40} />
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
                            {getSectionIcon(currentQuestion.section)}
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
                                    <HelpCircle size={16} className="mt-0.5 shrink-0" />
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
                                {currentQuestion.options?.map((option) => {
                                    const currentAnswer = answers[currentQuestion.id];
                                    const selectedOptions = Array.isArray(currentAnswer) ? currentAnswer : [];
                                    const isSelected = selectedOptions.includes(option);

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => updateMultipleChoice(option)}
                                            className={cn(
                                                "w-full p-4 rounded-xl text-left font-medium transition-all flex items-center justify-between",
                                                isSelected
                                                    ? "bg-amber-50 text-amber-700 border-2 border-amber-500"
                                                    : "bg-stone-50 text-stone-600 border-2 border-transparent hover:bg-stone-100"
                                            )}
                                        >
                                            {option}
                                            {isSelected && (
                                                <Check size={20} className="text-amber-500" />
                                            )}
                                        </button>
                                    );
                                })}
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
                    <ArrowLeft size={18} />
                    이전
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()}
                    className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg",
                        !isCurrentStepValid()
                            ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                            : "bg-stone-900 text-white hover:bg-stone-800 hover:-translate-y-1 shadow-stone-200"
                    )}
                >
                    {currentStep === questions.length - 1 ? "완료하기" : "다음"}
                    {currentStep === questions.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
                </button>
            </div>
        </div>
    );
}

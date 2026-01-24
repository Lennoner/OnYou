"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, Star, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Reusing same questions logic - Ideally should import from a shared constant
const questions = [
    {
        id: "basic1",
        type: "SCALE",
        text: "요즘 이 친구는 전반적으로 어때 보이나요?",
        scaleLabel: { min: "무기력해 보임", max: "활기차 보임" }
    },
    {
        id: "past1",
        type: "SCALE",
        text: "이 친구는 어려운 상황이 닥쳤을 때, 결국 스스로 극복해내는 편인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past2",
        type: "SCALE",
        text: "이 친구는 자신이 이룬 성과에 대해 충분히 자부심을 느끼는 것 같나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "past-select",
        type: "MULTIPLE_CHOICE",
        text: "이 친구가 좋은 결과를 만들어내는 비결은 무엇이라고 생각하나요?",
        options: ["운이나 타이밍", "주변 사람들의 도움", "본인의 노력과 역량"]
    },
    {
        id: "past-text",
        type: "TEXT",
        text: "이 친구가 가장 에너지가 넘치던 순간은 언제인가요?",
        placeholder: "구체적인 에피소드가 있다면 적어주세요."
    },
    {
        id: "present1",
        type: "SCALE",
        text: "이 친구는 주변 사람들에게 긍정적인 영향을 주고 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present2",
        type: "SCALE",
        text: "이 친구는 모임이나 그룹에서 꼭 필요한 존재인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-select",
        type: "SCALE",
        text: "나는 이 친구에게서 특별한 유대감을 느끼나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "present-text",
        type: "TEXT",
        text: "이 친구에게 고맙다고 말하고 싶거나, 자꾸 찾게 되는 이유는?",
        placeholder: "친구의 어떤 점이 당신에게 힘이 되나요?"
    },
    {
        id: "future1",
        type: "SCALE",
        text: "이 친구는 앞으로 자신이 원하는 분야에서 두각을 나타낼 잠재력이 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future2",
        type: "SCALE",
        text: "3년 뒤, 이 친구는 지금보다 더 멋지게 성장해 있을까요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    {
        id: "future-text",
        type: "TEXT",
        text: "이 친구가 두려움 없이 도전했으면 하는 것은 무엇인가요?",
        placeholder: "친구의 가능성을 응원해주세요."
    }
];

export function RegisteredFriendSurvey({ friendId }: { friendId: string }) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    const handleAnswer = (value: any) => {
        if (currentQuestion.type === "SCALE") {
            setScores(prev => ({ ...prev, [currentQuestion.id]: value }));
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
            setTimeout(() => {
                if (step < questions.length - 1) setStep(step + 1);
                else handleSubmit();
            }, 250);
        } else {
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
        }
    };

    const handleMultipleChoice = (option: string) => {
        const current = (answers[currentQuestion.id] as string[]) || [];
        const updated = current.includes(option)
            ? current.filter(o => o !== option)
            : [...current, option];
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: updated }));
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // In MVP, we can reuse the generic /api/feedback route if we pass null inviteCode and manual ID
            // BUT schema requires invites logic usually.
            // Better to use dedicated API for explicit friend feedback.

            const res = await fetch("/api/friends/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetUserId: friendId, // Who we are evaluating
                    // respondentId is inferred from session in real app, or hardcoded '1' for user
                    // But if I am '1', and I evaluate friend '2'.
                    scores,
                    answers
                })
            });

            if (!res.ok) throw new Error("Failed");

            setIsFinished(true);
            toast.success("평가가 완료되었습니다.");
        } catch (e) {
            toast.error("저장에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white p-8 text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Check className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">평가 완료!</h1>
                    <p className="text-stone-400 text-lg mb-8">
                        친구의 우주에 당신의 별이 추가되었습니다.
                    </p>
                    <button
                        onClick={() => router.push("/friends")}
                        className="border border-stone-600 px-8 py-3 rounded-full hover:bg-stone-800 transition-colors"
                    >
                        친구 목록으로 돌아가기
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 md:p-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white md:rounded-3xl shadow-xl overflow-hidden min-h-screen md:min-h-[700px] flex flex-col">
                <div className="p-6 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                    <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600">
                        <ArrowLeft />
                    </button>
                    <div className="flex-1 px-4">
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-amber-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                    <span className="text-xs font-bold text-stone-300">
                        {step + 1} / {questions.length}
                    </span>
                </div>

                <div className="flex-1 p-8 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 leading-snug">
                                {currentQuestion.text}
                            </h2>

                            {currentQuestion.type === "SCALE" && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold text-stone-400 px-1">
                                        <span>{currentQuestion.scaleLabel?.min}</span>
                                        <span>{currentQuestion.scaleLabel?.max}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => handleAnswer(val)}
                                                className={cn(
                                                    "flex-1 h-14 rounded-xl font-bold text-lg transition-all",
                                                    scores[currentQuestion.id] === val
                                                        ? "bg-amber-500 text-white shadow-lg"
                                                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                                                )}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Text & Multiple Choice Handlers (Simplified dump) */}
                            {currentQuestion.type === "TEXT" && (
                                <div className="space-y-4">
                                    <textarea
                                        value={answers[currentQuestion.id] || ""}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                        placeholder={currentQuestion.placeholder}
                                        className="w-full h-40 p-4 bg-stone-50 border-2 border-stone-100 rounded-xl"
                                    />
                                    <button onClick={handleNext} className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold">다음</button>
                                </div>
                            )}
                            {currentQuestion.type === "MULTIPLE_CHOICE" && (
                                <div className="space-y-3">
                                    {currentQuestion.options?.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleMultipleChoice(opt)}
                                            className={cn(
                                                "w-full p-4 rounded-xl text-left font-medium transition-all flex justify-between",
                                                (answers[currentQuestion.id] as string[] || []).includes(opt) ? "bg-amber-50 border-amber-500 border-2" : "bg-stone-50"
                                            )}
                                        >
                                            {opt}
                                            {(answers[currentQuestion.id] as string[] || []).includes(opt) && <Check size={16} />}
                                        </button>
                                    ))}
                                    <button onClick={handleNext} className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold mt-4">다음</button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

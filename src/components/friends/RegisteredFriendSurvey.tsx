"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FRIEND_EVALUATION_QUESTIONS } from "@/constants/survey-questions";

const questions = FRIEND_EVALUATION_QUESTIONS;

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

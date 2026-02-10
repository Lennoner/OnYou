"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

// Questions mirroring SelfSurvey structure (12 Questions)
const questions = [
    // 1. Basic (Observed Mood)
    {
        id: "basic1",
        type: "SCALE",
        text: "요즘 이 친구는 전반적으로 어때 보이나요?",
        scaleLabel: { min: "무기력해 보임", max: "활기차 보임" }
    },
    // 2. Resilience
    {
        id: "past1",
        type: "SCALE",
        text: "이 친구는 어려운 상황이 닥쳤을 때, 결국 스스로 극복해내는 편인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 3. Pride
    {
        id: "past2",
        type: "SCALE",
        text: "이 친구는 자신이 이룬 성과에 대해 충분히 자부심을 느끼는 것 같나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 4. Attribution (Multiple Choice)
    {
        id: "past-select",
        type: "MULTIPLE_CHOICE",
        text: "이 친구가 좋은 결과를 만들어내는 비결은 무엇이라고 생각하나요?",
        subtext: "해당하는 것을 모두 선택해주세요.",
        options: ["운이나 타이밍", "주변 사람들의 도움", "본인의 노력과 역량"]
    },
    // 5. Text (Energy Moment)
    {
        id: "past-text",
        type: "TEXT",
        text: "이 친구가 가장 에너지가 넘치거나 반짝였던 순간은 언제인가요?",
        placeholder: "구체적인 에피소드가 있다면 적어주세요."
    },
    // 6. Influence
    {
        id: "present1",
        type: "SCALE",
        text: "이 친구는 주변 사람들에게 긍정적인 영향을 주고 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 7. Belonging 1
    {
        id: "present2",
        type: "SCALE",
        text: "이 친구는 모임이나 그룹에서 꼭 필요한 존재인가요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 8. Belonging 2
    {
        id: "present-select", // mapped to present-select score in analysis for now
        type: "SCALE",
        text: "나는 이 친구에게서 특별한 유대감을 느끼나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 9. Text (Thanks/Reason)
    {
        id: "present-text",
        type: "TEXT",
        text: "이 친구에게 고맙다고 말하고 싶거나, 자꾸 찾게 되는 이유는?",
        placeholder: "친구의 어떤 점이 당신에게 힘이 되나요?"
    },
    // 10. Potential
    {
        id: "future1",
        type: "SCALE",
        text: "이 친구는 앞으로 자신이 원하는 분야에서 두각을 나타낼 잠재력이 있나요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 11. Growth
    {
        id: "future2",
        type: "SCALE",
        text: "3년 뒤, 이 친구는 지금보다 더 멋지게 성장해 있을까요?",
        scaleLabel: { min: "전혀 아니다", max: "매우 그렇다" }
    },
    // 12. Text (Challenge)
    {
        id: "future-text",
        type: "TEXT",
        text: "이 친구가 두려움 없이 도전했으면 하는 것은 무엇인가요?",
        placeholder: "친구의 가능성을 응원해주세요."
    }
];

export function FriendSurvey() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const code = searchParams.get("code");
    const targetName = searchParams.get("user") || "친구"; // The user being evaluated

    const [step, setStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({}); // simple numeric answers
    const [answers, setAnswers] = useState<Record<string, any>>({}); // text or array answers
    const [myNick, setMyNick] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    const handleAnswer = (value: any) => {
        // Save to state
        if (currentQuestion.type === "SCALE") {
            setScores(prev => ({ ...prev, [currentQuestion.id]: value }));
            setAnswers(prev => ({ ...prev, [currentQuestion.id]: value })); // Mirror in answers for safety

            // Auto advance
            setTimeout(() => {
                if (step < questions.length - 1) setStep(step + 1);
                else setStep(step + 1); // Nickname phase
            }, 250);
        } else {
            // Text or Multiple Choice - Manual Advance
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
            // Setup for submission phase
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!myNick.trim()) {
            toast.error("이름을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inviteCode: code,
                    respondentName: myNick,
                    scores, // Numeric scores map
                    answers // Full answers including text
                })
            });

            if (!res.ok) throw new Error("Failed");
            setIsFinished(true);
            toast.success("전송되었습니다!");
        } catch (e) {
            toast.error("전송 실패");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white p-8 text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-3xl font-bold mb-4">답변해주셔서 감사합니다!</h1>
                    <p className="text-stone-400 text-lg mb-8">
                        {targetName}님에게 당신의 따뜻한 마음이 전달되었습니다.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="border border-stone-600 px-8 py-3 rounded-full hover:bg-stone-800 transition-colors"
                    >
                        온유 홈으로 가기
                    </button>
                </motion.div>
            </div>
        );
    }

    // Name Input Phase (After last question)
    if (step === questions.length) {
        return (
            <div className="min-h-screen bg-stone-50 p-6 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">거의 다 왔어요!</h2>
                    <label className="block text-sm font-bold text-stone-700 mb-2">
                        {targetName}님에게 이 답변을 보내는<br />당신의 이름(애칭)은 무엇인가요?
                    </label>
                    <input
                        type="text"
                        value={myNick}
                        onChange={(e) => setMyNick(e.target.value)}
                        className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-stone-900 font-bold mb-6 focus:outline-none"
                        placeholder="예: 너의 베프"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold text-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "전송 중..." : "답변 완료하기"} <span>✅</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 md:p-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white md:rounded-3xl shadow-xl overflow-hidden min-h-screen md:min-h-[700px] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-stone-100 bg-stone-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-stone-400 bg-white px-3 py-1 rounded-full border border-stone-200">
                            For. {targetName}
                        </span>
                        <span className="text-xs font-bold text-stone-300">
                            {step + 1} / {questions.length}
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-amber-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 leading-snug">
                                {currentQuestion.text}
                            </h2>

                            {/* Scale */}
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
                                                        ? "bg-amber-500 text-white shadow-lg scale-105"
                                                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                                                )}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Multiple Choice */}
                            {currentQuestion.type === "MULTIPLE_CHOICE" && (
                                <div className="space-y-3">
                                    {currentQuestion.options?.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleMultipleChoice(opt)}
                                            className={cn(
                                                "w-full p-4 rounded-xl text-left font-medium transition-all flex justify-between items-center",
                                                (answers[currentQuestion.id] as string[] || []).includes(opt)
                                                    ? "bg-amber-50 border-2 border-amber-500 text-amber-900"
                                                    : "bg-stone-50 border-2 border-transparent hover:bg-stone-100 text-stone-600"
                                            )}
                                        >
                                            {opt}
                                            {(answers[currentQuestion.id] as string[] || []).includes(opt) && <span>✅</span>}
                                        </button>
                                    ))}
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={handleNext}
                                            disabled={!(answers[currentQuestion.id] as string[] || []).length}
                                            className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold disabled:opacity-50"
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Text */}
                            {currentQuestion.type === "TEXT" && (
                                <div className="space-y-4">
                                    <textarea
                                        value={answers[currentQuestion.id] || ""}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                        placeholder={currentQuestion.placeholder}
                                        className="w-full h-40 p-4 bg-stone-50 border-2 border-stone-100 focus:border-stone-900 rounded-xl resize-none focus:outline-none text-stone-800 leading-relaxed"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleNext}
                                            disabled={!answers[currentQuestion.id]}
                                            className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold disabled:opacity-50"
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Nav */}
                <div className="p-6 border-t border-stone-100 flex justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={step === 0}
                        className="text-stone-400 hover:text-stone-600 disabled:opacity-30"
                    >
                        <span className="text-xl">←</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

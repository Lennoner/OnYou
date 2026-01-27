"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Mock Templates to lower the burden of writing
const templates = [
    { id: "t1", icon: "❤️", label: "고마워요", text: "오늘 도와줘서 정말 고마워. 네 덕분에 큰 힘이 됐어!", color: "bg-rose-100 text-rose-600" },
    { id: "t2", icon: "☕", label: "수고했어", text: "요즘 많이 바쁘지? 항상 열심히 하는 모습 멋지다. 커피 한잔하면서 쉬어가!", color: "bg-amber-100 text-amber-700" },
    { id: "t3", icon: "☀️", label: "응원해", text: "넌 충분히 잘하고 있어. 지금처럼만 하면 다 잘 될 거야. 화이팅!", color: "bg-orange-100 text-orange-600" },
    { id: "t4", icon: "✨", label: "축하해", text: "좋은 소식 들었어! 진심으로 축하해. 앞으로 더 좋은 일만 가득하길 바라.", color: "bg-emerald-100 text-emerald-600" },
];

// Mock Recent Contacts
const recentContacts = ["민수", "지영", "현우", "서연"];

export function LetterWriter() {
    const searchParams = useSearchParams();
    const initialTo = searchParams.get('to') || "";

    const [step, setStep] = useState<"compose" | "sent">("compose");
    const [recipient, setRecipient] = useState(initialTo);
    const [message, setMessage] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const handleTemplateClick = (template: typeof templates[0]) => {
        setSelectedTemplate(template.id);
        setMessage(template.text);
    };

    const handleSend = async () => {
        if (!recipient.trim() || !message.trim()) return;

        try {
            const res = await fetch('/api/letters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: message,
                    template: selectedTemplate,
                    recipientName: recipient
                })
            });

            if (!res.ok) throw new Error("Failed");

            // Success UI
            setStep("sent");
            toast.success("메시지가 성공적으로 전송되었습니다!");
        } catch (error) {
            console.error(error);
            toast.error("메시지 전송에 실패했습니다.");
        }
    };

    const handleReset = () => {
        setStep("compose");
        setRecipient("");
        setMessage("");
        setSelectedTemplate(null);
    }

    return (
        <div className="min-h-full bg-[#FAFAF9] pb-20">
            <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">

                {/* Header */}
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-stone-900 mb-3 font-serif">마음 배송</h1>
                    <p className="text-stone-500">
                        거창한 말이 아니어도 괜찮아요.<br />
                        가벼운 인사로 따뜻한 마음을 전해보세요.
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {step === "compose" ? (
                        <motion.div
                            key="compose"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* 1. Recipient Selection */}
                            <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                                    To. 누구에게 보낼까요?
                                </label>

                                <div className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        placeholder="받는 사람 이름 (또는 이메일)"
                                        className="w-full text-lg border-b-2 border-stone-100 py-2 focus:border-stone-900 focus:outline-none transition-colors bg-transparent placeholder:text-stone-300"
                                    />

                                    {/* Recent Contacts Chips */}
                                    <div className="flex flex-wrap gap-2">
                                        {recentContacts.map(name => (
                                            <button
                                                key={name}
                                                onClick={() => setRecipient(name)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                                                    recipient === name
                                                        ? "bg-stone-800 text-white"
                                                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                                                )}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                        <button className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-200 transition-colors">
                                            <span>➕</span>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Message Editor */}
                            <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                                        Message
                                    </label>
                                    <button
                                        onClick={() => { setMessage(""); setSelectedTemplate(null) }}
                                        className="text-xs text-stone-400 underline hover:text-stone-600"
                                    >
                                        초기화
                                    </button>
                                </div>

                                {/* Templates (Horizontal Scroll) */}
                                <div className="flex gap-3 overflow-x-auto pb-4 mb-2 -mx-2 px-2 custom-scrollbar">
                                    {templates.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => handleTemplateClick(t)}
                                            className={cn(
                                                "flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border transition-all whitespace-nowrap",
                                                selectedTemplate === t.id
                                                    ? `${t.color} border-current ring-1 ring-current`
                                                    : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                                            )}
                                        >
                                            <span className="text-base">{t.icon}</span>
                                            <span className="font-bold text-sm">{t.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Text Area (Card Style) */}
                                <div className={cn(
                                    "relative p-6 rounded-2xl transition-colors duration-300 min-h-[200px] flex flex-col",
                                    selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.color.split(' ')[0] : "bg-stone-50"
                                )}>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="이곳에 마음을 적어주세요..."
                                        className="w-full h-full bg-transparent resize-none focus:outline-none text-stone-800 leading-relaxed placeholder:text-stone-400/70"
                                        rows={6}
                                    />
                                    <div className="mt-auto pt-4 flex justify-end">
                                        <span className="text-xs font-medium opacity-50">
                                            From. 김지수
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                disabled={!recipient.trim() || !message.trim()}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95",
                                    !recipient.trim() || !message.trim()
                                        ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                                        : "bg-stone-900 text-white shadow-xl hover:bg-stone-800"
                                )}
                            >
                                마음 보내기 <span>✉️</span>
                            </button>

                        </motion.div>
                    ) : (
                        /* Sent Success View */
                        <motion.div
                            key="sent"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                        >
                            <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-8 animate-bounce-slow text-4xl">
                                📮
                            </div>
                            <h2 className="text-2xl font-bold text-stone-900 mb-2 font-serif">
                                {recipient}님에게 마음이 배달되었어요!
                            </h2>
                            <p className="text-stone-500 mb-8">
                                당신의 따뜻한 한마디가 누군가의 오늘을<br />
                                조금 더 행복하게 만들었을 거예요.
                            </p>
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 mx-auto"
                            >
                                다른 편지 쓰기 <span>→</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

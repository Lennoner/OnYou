"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

// Sentence Completion Templates (Reused for Invite Message)
const inviteTemplates = [
    {
        id: "help",
        label: "도움 요청",
        text: "이번에 내가 어떤 사람인지 알아보는 프로젝트를 하고 있어. 네가 보는 나의 장점을 솔직하게 알려주면 정말 큰 도움이 될 거야!",
        color: "bg-amber-50 border-amber-200"
    },
    {
        id: "casual",
        label: "가볍게",
        text: "나 이거 해보고 있는데 재밌더라! 너도 나에 대해 어떻게 생각하는지 3분만 시간 내서 알려줄 수 있어?",
        color: "bg-stone-50 border-stone-200"
    },
    {
        id: "sincere",
        label: "진지하게",
        text: "너는 나를 가장 잘 아는 친구 중 한 명이잖아. 내가 모르는 나의 모습을 너를 통해 발견하고 싶어.",
        color: "bg-rose-50 border-rose-200"
    }
];

export function InviteCreator() {
    const [step, setStep] = useState<"create" | "share">("create");
    const [inviteName, setInviteName] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState("help");
    const [customMessage, setCustomMessage] = useState(inviteTemplates[0].text);
    const [copied, setCopied] = useState(false);

    const handleTemplateChange = (template: typeof inviteTemplates[0]) => {
        setSelectedTemplateId(template.id);
        setCustomMessage(template.text);
    };

    // State for Link
    const [inviteLink, setInviteLink] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const { data: session } = useSession();
    const myName = session?.user?.name || "사용자";

    const handleCreate = async () => {
        // Validation removed as we don't need friend name to generate a generic link anymore
        // But if we want to keep "Personalized Message", we can keep the input but NOT put it in the link.

        setIsCreating(true);
        try {
            const res = await fetch('/api/invites', { method: 'POST' });
            if (!res.ok) throw new Error("Failed");

            const data = await res.json();
            // Use current origin for local testing support
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://onyou.app';
            setInviteLink(`${origin}/invite?code=${data.code}&user=${encodeURIComponent(myName)}`);
            setStep("share");
        } catch (e) {
            toast.error("초대장 생성에 실패했습니다.");
            console.error(e);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${customMessage}\n\n👉 링크: ${inviteLink}`);
        setCopied(true);
        toast.success("초대 메시지가 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKakaoShare = () => {
        toast.info("카카오톡 공유 창이 열립니다. (데모)");
    };

    return (
        <div className="min-h-full bg-[#FAFAF9] pb-20">
            <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">

                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-stone-900 mb-3 font-serif">
                        {step === "create" ? "맞춤형 초대장 만들기" : "초대장 배달 준비 완료!"}
                    </h1>
                    <p className="text-stone-500">
                        {step === "create"
                            ? "진심이 담긴 초대는 더 깊은 피드백을 이끌어냅니다."
                            : "이제 친구에게 링크를 전달하기만 하면 돼요."}
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {step === "create" ? (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* 1. Name Input */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                                <label className="block text-sm font-bold text-stone-900 mb-4">
                                    누구에게 보낼까요?
                                </label>
                                <input
                                    type="text"
                                    value={inviteName}
                                    onChange={(e) => setInviteName(e.target.value)}
                                    placeholder="친구 이름 입력 (예: 민수)"
                                    className="w-full text-xl p-4 bg-stone-50 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none transition-colors placeholder:text-stone-300 font-bold"
                                />
                            </section>

                            {/* 2. Message Template */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                                <label className="block text-sm font-bold text-stone-900 mb-4">
                                    어떤 톤으로 말할까요?
                                </label>

                                <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                    {inviteTemplates.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => handleTemplateChange(t)}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                                                selectedTemplateId === t.id
                                                    ? "bg-stone-900 text-white border-stone-900"
                                                    : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
                                            )}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                <div className={cn(
                                    "p-6 rounded-2xl border-2 transition-colors",
                                    inviteTemplates.find(t => t.id === selectedTemplateId)?.color
                                )}>
                                    <textarea
                                        value={customMessage}
                                        onChange={(e) => setCustomMessage(e.target.value)}
                                        className="w-full h-32 bg-transparent resize-none focus:outline-none text-stone-800 leading-relaxed font-medium"
                                    />
                                    <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center text-xs text-stone-500 font-bold">
                                        <span>To. {inviteName || "(친구 이름)"}</span>
                                        <span>From. 지수</span>
                                    </div>
                                </div>
                            </section>

                            <button
                                onClick={handleCreate}
                                disabled={isCreating}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2",
                                    isCreating ? "bg-stone-300 text-stone-500" : "bg-stone-900 text-white hover:bg-stone-800"
                                )}
                            >
                                {isCreating ? "생성 중..." : "초대장 만들기"} {!isCreating && <span>→</span>}
                            </button>
                        </motion.div>
                    ) : (
                        /* Share Step */
                        <motion.div
                            key="share"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* Preview Card */}
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-rose-400"></div>

                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-stone-100 rounded-full mx-auto flex items-center justify-center text-3xl mb-4">
                                        📩
                                    </div>
                                    <h3 className="text-xl font-bold text-stone-900 mb-1">
                                        {inviteName}님을 위한 초대장
                                    </h3>
                                    <p className="text-stone-400 text-sm">링크가 생성되었습니다.</p>
                                </div>

                                <div className="bg-stone-50 p-4 rounded-xl text-stone-600 text-sm font-medium mb-6 text-left">
                                    <p className="mb-4">&quot;{customMessage}&quot;</p>
                                    <p className="text-stone-400 text-xs break-all border-t border-stone-200 pt-2">
                                        {inviteLink}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleKakaoShare}
                                        className="py-4 bg-[#FEE500] text-[#191919] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <span className="text-xl">💬</span> 카톡 공유
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className={cn(
                                            "py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border",
                                            copied
                                                ? "bg-green-50 text-green-600 border-green-200"
                                                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                                        )}
                                    >
                                        {copied ? <span>✅</span> : <span>📋</span>}
                                        {copied ? "복사됨!" : "링크 복사"}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setStep("create");
                                    setInviteName("");
                                }}
                                className="w-full py-4 text-stone-400 font-bold hover:text-stone-600 flex items-center justify-center gap-2 transition-colors"
                            >
                                <span>🔄</span> 다른 친구 초대하기
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

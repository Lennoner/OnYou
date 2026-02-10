"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type DashboardData = {
    user: {
        name: string;
        email: string;
        image?: string;
    };
    stats: {
        friendCount: number;
        feedbackCount: number;
        letterCount: number;
        inviteCount: number;
    };
    activity: {
        hasSelfSurvey: boolean;
        feedbackCount: number;
        totalInvited: number;
        responseCount: number;
        responseRate: number;
        primaryAction: 'no_survey' | 'no_invite' | 'waiting_feedback' | 'has_feedback';
    };
};

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const userName = data?.user?.name || "사용자";
    const friendCount = data?.stats?.friendCount || 0;
    const feedbackCount = data?.activity?.feedbackCount || 0;
    const responseCount = data?.activity?.responseCount || 0;
    const totalInvited = data?.activity?.totalInvited || 0;
    const responseRate = data?.activity?.responseRate || 0;
    const primaryAction = data?.activity?.primaryAction || 'no_survey';

    // ... (No changes to imports)

    // ...

    // Render priority card based on state
    const renderPriorityCard = () => {
        if (primaryAction === 'no_survey') {
            return (
                <Link href="/discover" className="md:col-span-2 block">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px] md:min-h-[240px]">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl md:text-2xl">
                                    🪞
                                </div>
                                <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                                    <span className="text-xs md:text-sm font-bold">시작하기</span>
                                    <span className="text-base md:text-lg">↗</span>
                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-3">
                                    ✨ 첫 번째 단계
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">나를 먼저 알아보세요</h2>
                                <p className="text-white/80 max-w-md text-sm md:text-base">
                                    친구들에게 피드백을 받기 전,<br />
                                    먼저 스스로를 돌아보는 시간을 가져보세요.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            );
        }

        if (primaryAction === 'no_invite') {
            return (
                <Link href="/invite" className="md:col-span-2 block">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: 0.1 }}
                        className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px] md:min-h-[240px]">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl md:text-2xl">
                                    📤
                                </div>
                                <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                                    <span className="text-xs md:text-sm font-bold">초대하기</span>
                                    <span className="text-base md:text-lg">↗</span>
                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-3">
                                    🎯 다음 단계
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">친구들을 초대해보세요</h2>
                                <p className="text-white/80 max-w-md text-sm md:text-base">
                                    가까운 친구들에게 나에 대한<br />
                                    솔직한 피드백을 요청해보세요.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            );
        }

        if (primaryAction === 'waiting_feedback') {
            return (
                <Link href="/discover" className="md:col-span-2 block">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: 0.1 }}
                        className="w-full h-full bg-stone-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-stone-600/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px] md:min-h-[240px]">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-xl md:text-2xl animate-pulse">
                                    ⏳
                                </div>
                                <div className="flex items-center gap-2 text-stone-400 group-hover:text-white transition-colors">
                                    <span className="text-xs md:text-sm font-bold">확인하기</span>
                                    <span className="text-base md:text-lg">↗</span>
                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 bg-stone-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-3 text-stone-300">
                                    🔔 피드백 대기 중
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">친구들의 응답을 기다리는 중...</h2>
                                <p className="text-stone-400 max-w-md mb-4 text-sm md:text-base">
                                    초대한 친구들이 피드백을 보내면<br />
                                    여기서 바로 확인할 수 있어요.
                                </p>
                                <div className="max-w-sm">
                                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                                        <span>응답률</span>
                                        <span>{responseCount}/{totalInvited > 0 ? totalInvited : '∞'} ({responseRate}%)</span>
                                    </div>
                                    <div className="w-full bg-stone-700 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-stone-500 h-full transition-all"
                                            style={{ width: `${Math.min(responseRate, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            );
        }

        // has_feedback - Default
        return (
            <Link href="/discover" className="md:col-span-2 block">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: 0.1 }}
                    className="w-full h-full bg-[#1C1917] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-stone-200"
                >
                    <div className="absolute top-0 right-0 p-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/30 transition-all duration-500"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px] md:min-h-[240px]">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-amber-400 animate-pulse text-xl md:text-2xl">
                                ✨
                            </div>
                            <div className="flex items-center gap-2 text-stone-400 group-hover:text-white transition-colors">
                                <span className="text-xs md:text-sm font-bold">확인하기</span>
                                <span className="text-base md:text-lg">↗</span>
                            </div>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-3 border border-amber-500/30">
                                🎉 새로운 발견
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">{feedbackCount}개의 피드백이 도착했어요!</h2>
                            <p className="text-stone-400 max-w-md mb-4 text-sm md:text-base">
                                친구들이 {userName}님의 숨겨진 매력을 발견했어요.<br />
                                지금 바로 내가 생각한 나(Self)와 비교해보세요.
                            </p>
                            <div className="max-w-sm">
                                <div className="flex justify-between text-xs text-stone-500 mb-1">
                                    <span>진행률 ({responseCount}/{totalInvited > 0 ? totalInvited : '∞'})</span>
                                    <span>{responseRate}%</span>
                                </div>
                                <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all"
                                        style={{ width: `${Math.min(responseRate, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    };

    // ...

    return (
        <div className="w-full h-full overflow-y-auto bg-stone-50 pb-24">
            {/* Header */}
            <header className="p-6 md:p-10 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-2">
                        반가워요, <span className="text-stone-500">{userName}</span>님
                    </h1>
                    <p className="text-stone-500 text-sm md:text-base">오늘도 나를 알아가는 여정을 시작해볼까요?</p>
                </div>
                <Link href="/settings">
                    <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden border border-stone-100 shadow-sm relative">
                        {data?.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={data.user.image} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                                👤
                            </div>
                        )}
                    </div>
                </Link>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto p-6 md:p-10 pt-0">

                {/* [1] Priority Action Card (Dynamic State) */}
                {renderPriorityCard()}

                {/* [2] Quick Action: Invite */}
                <Link href="/invite" className="block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: 0.2 }}
                        className="w-full h-full bg-white border border-stone-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:border-stone-900 hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors text-xl md:text-2xl">
                                📤
                            </div>
                            {data?.stats?.inviteCount ? (
                                <span className="text-[10px] md:text-xs font-bold bg-stone-100 px-2 py-1 rounded text-stone-500">
                                    {data.stats.inviteCount}개 발송됨
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-6 md:mt-8">
                            <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">지인 초대하기</h3>
                            <p className="text-xs md:text-sm text-stone-500 mb-6 leading-relaxed">
                                더 많은 친구들에게<br />나의 가치를 물어보세요.
                            </p>
                            <button className="w-full py-3 border border-stone-200 rounded-xl font-bold text-sm text-stone-600 group-hover:bg-stone-50 transition-colors">
                                초대장 만들기
                            </button>
                        </div>
                    </motion.div>
                </Link>

                {/* [3] My Universe (Network) */}
                <Link href="/universe" className="block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: 0.3 }}
                        className="w-full h-full bg-stone-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:bg-stone-200 transition-colors relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl md:text-2xl">🕸️</span>
                                {feedbackCount > 0 && (
                                    <span className="text-[10px] md:text-xs font-bold bg-white px-2 py-1 rounded text-stone-500 shadow-sm">
                                        +{feedbackCount} 새 연결
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-stone-900">나의 우주</h3>
                            <p className="text-stone-500 text-xs md:text-sm">
                                {friendCount + feedbackCount}개의 별과 연결되어 있습니다.
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-stone-300 border-2 border-stone-100"></div>
                            ))}
                            {(friendCount + feedbackCount) > 3 && (
                                <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-stone-100 flex items-center justify-center text-[10px] text-white font-bold">
                                    +{friendCount + feedbackCount - 3}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </Link>

                {/* [4] Gratitude Letter */}
                <Link href="/letters" className="md:col-span-2 block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: 0.4 }}
                        className="w-full h-full bg-white border border-stone-200 rounded-3xl p-6 md:p-8 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-3 md:p-4 bg-rose-50 rounded-2xl text-rose-500 text-lg md:text-xl">
                                💌
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-stone-900">감사 쪽지</h3>
                                <p className="text-stone-500 text-xs md:text-sm">
                                    {data?.stats?.letterCount
                                        ? `${data.stats.letterCount}개의 쪽지를 보냈어요`
                                        : '소중한 사람에게 닿을 엽서 쓰기'
                                    }
                                </p>
                            </div>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-stone-50 text-stone-900 rounded-xl font-bold text-sm hover:bg-stone-900 hover:text-white transition-colors">
                            작성하기 <span className="text-xs">➡️</span>
                        </button>
                    </motion.div>
                </Link>
            </div>
        </div >
    );
}

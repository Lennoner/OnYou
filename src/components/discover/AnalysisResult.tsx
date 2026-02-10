"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip
} from "recharts";

// Mock Data: Radar Chart
const radarData = [
    { subject: '회복탄력성', A: 3, B: 4.5, fullMark: 5 },
    { subject: '성취자부심', A: 2.5, B: 4.2, fullMark: 5 },
    { subject: '긍정적 영향', A: 3, B: 4.8, fullMark: 5 },
    { subject: '소속감', A: 2, B: 4.5, fullMark: 5 },
    { subject: '잠재력', A: 3.5, B: 4.6, fullMark: 5 },
    { subject: '성장기대', A: 4, B: 4.7, fullMark: 5 },
];

// Mock Data: Feedbacks grouped by Question
const feedbackGroups = [
    {
        id: "q1",
        question: "이 친구가 가장 에너지가 넘치거나 반짝였던 순간은 언제인가요?",
        answers: [
            {
                author: "민수",
                relation: "고등학교 동창",
                text: "축제 준비할 때 네가 리더 맡아서 밤새가며 소품 만들던 때가 기억나. 다들 지쳐있을 때 네가 농담하면서 분위기 띄우고 끝까지 책임지는 모습이 진짜 멋졌어."
            },
            {
                author: "서연",
                relation: "오랜 친구",
                text: "네가 좋아하는 밴드 공연 보러 갔을 때! 그렇게 행복하게 웃는 모습 처음 봤어. 무언가를 순수하게 좋아하는 네 모습이 참 빛나더라."
            }
        ]
    },
    {
        id: "q2",
        question: "이 친구에게 고맙다고 말하고 싶거나, 이 친구를 찾게 되는 구체적인 이유는?",
        answers: [
            {
                author: "지영",
                relation: "대학 동기",
                text: "힘든 일 있을 때 너한테 털어놓으면 묘하게 위로가 돼. 해결책을 줘서가 아니라, 진심으로 들어주는 게 느껴져서 그런 것 같아. 항상 고마워."
            },
            {
                author: "현우",
                relation: "직장 동료",
                text: "업무적으로 막힐 때 네가 툭 던지는 아이디어가 돌파구가 될 때가 많아. 너는 생각의 폭이 넓어서 같이 일하면 든든해."
            },
            {
                author: "은지",
                relation: "스터디 멤버",
                text: "그냥 네가 있으면 분위기가 편해져. 어색한 사람들도 네 덕분에 금방 친해지잖아."
            }
        ]
    },
    {
        id: "q3",
        question: "이 친구가 두려움 없이 도전했으면 하는 것은 무엇인가요?",
        answers: [
            {
                author: "민수",
                relation: "고등학교 동창",
                text: "너 글 쓰는 거 좋아하잖아. 블로그만 하지 말고 진짜 책을 한번 써봤으면 좋겠어. 네 감성은 혼자 보기 아까워."
            },
            {
                author: "지영",
                relation: "대학 동기",
                text: "해외 인턴십! 예전부터 가고 싶어 했잖아. 지금도 늦지 않았으니 꼭 도전해봐."
            }
        ]
    }
];

interface AnalysisResultProps {
    onRetake?: () => void;
    userName?: string;
    data?: {
        radarData: any[];
        answers?: Record<string, any>;
        peerAnswers?: {
            q1: any[];
            q2: any[];
            q3: any[];
        };
        peerCount?: number;
    };
}

export function AnalysisResult({ onRetake, data, userName }: AnalysisResultProps) {
    const displayName = userName || '사용자';
    // Use passed data or fallback to mock
    const chartData = data?.radarData || radarData;
    const peerCount = data?.peerCount || 0;

    // Transform Peer Answers to UI format or fall back to mock if empty
    const realFeedbackGroups = (data?.peerAnswers && peerCount > 0) ? [
        {
            id: "q1",
            question: "이 친구가 가장 에너지가 넘치거나 반짝였던 순간은 언제인가요?",
            answers: data.peerAnswers.q1.map((a: any) => ({
                text: a.text,
                author: a.author,
                relation: "친구"
            }))
        },
        {
            id: "q2",
            question: "이 친구에게 고맙다고 말하고 싶거나, 이 친구를 찾게 되는 구체적인 이유는?",
            answers: data.peerAnswers.q2.map((a: any) => ({
                text: a.text,
                author: a.author,
                relation: "친구"
            }))
        },
        {
            id: "q3",
            question: "이 친구가 두려움 없이 도전했으면 하는 것은 무엇인가요?",
            answers: data.peerAnswers.q3.map((a: any) => ({
                text: a.text,
                author: a.author,
                relation: "친구"
            }))
        }
    ] : feedbackGroups; // Fallback to mock for demo if no real data

    return (
        <div className="min-h-screen bg-stone-50 pb-20 relative px-4">
            {/* Retake Survey Button (Absolute or Fixed) */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={onRetake}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-500 hover:text-stone-900 hover:border-stone-300 transition-colors shadow-sm"
                >
                    <span>🔄</span>
                    다시 진단하기
                </button>
            </div>

            <div className="max-w-4xl mx-auto py-12 md:py-20">

                {/* 1. Clean Minimal Header */}
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase text-amber-600 bg-amber-50 rounded-full"
                    >
                        Analysis Report
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight"
                    >
                        {displayName}님의 발견된 가치
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-500 text-lg max-w-xl mx-auto"
                    >
                        나의 시선과 친구들의 시선이 만나는 곳에서<br className="hidden md:block" />
                        새로운 나를 발견해보세요.
                    </motion.p>
                </header>

                {/* 2. Key Insight (Radar Chart Only) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row gap-12 items-center mb-12 bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-sm"
                >
                    {/* Chart */}
                    <div className="w-full md:w-1/2 h-[350px]">
                        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-6 text-center">
                            Self vs Peer View
                        </h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                <PolarGrid stroke="#e7e5e4" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 13 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                <Radar
                                    name="나의 생각"
                                    dataKey="A"
                                    stroke="#d6d3d1"
                                    strokeWidth={2}
                                    fill="#d6d3d1"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="친구들의 생각"
                                    dataKey="B"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    fill="#f59e0b"
                                    fillOpacity={0.4}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 text-xs font-medium text-stone-500 mt-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-stone-300"></span> 나의 생각
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span> 친구들의 생각
                            </div>
                        </div>
                    </div>

                    {/* Text Summary */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
                            친구들은 당신을<br />
                            <span className="text-amber-600 decoration-amber-200 underline decoration-2 underline-offset-4">더 높게 평가</span>하고 있어요
                        </h2>
                        <p className="text-stone-600 leading-relaxed text-lg">
                            스스로 생각하는 것보다 친구들은 {displayName}님의 <strong>영향력</strong>과 <strong>회복탄력성</strong>을 높게 평가했습니다.
                            특히 힘든 상황에서도 묵묵히 해내는 모습이 주변에 큰 울림을 주었던 것 같아요.
                        </p>
                        <div className="pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-lg text-stone-600 text-sm font-medium">
                                <span>💬</span>
                                총 {peerCount}개의 마음이 도착했습니다.
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2.5 My Records (New Section) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-stone-900">나의 기록</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { id: 'past-text', label: '가장 에너지가 넘치던 순간' },
                            { id: 'present-text', label: '사람들이 나를 찾는 이유' },
                            { id: 'future-text', label: '두려움 없이 도전하고 싶은 것' }
                        ].map((item, idx) => {
                            // Extract answer safely
                            const answerText = data?.answers ? data.answers[item.id] : null;

                            if (!answerText) return null;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm transition-all hover:shadow-md h-full flex flex-col"
                                >
                                    <h3 className="text-xs font-bold text-stone-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                        {item.label}
                                    </h3>
                                    <div className="flex-1">
                                        <p className="text-stone-800 font-medium leading-relaxed whitespace-pre-wrap text-lg font-serif">
                                            &quot;{answerText}&quot;
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
                                        <span className="text-xs text-stone-400 font-medium">written by me</span>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Empty State if no answers */}
                        {(!data?.answers || !Object.keys(data.answers).some(k => k.includes('-text'))) && (
                            <div className="col-span-full py-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400">
                                <p>아직 기록된 텍스트 답변이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* 3. Blind Spot Analysis (Johari Window) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 bg-stone-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-10 relative z-10">
                        {/* Left: Concept Explanation */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                                <span>ℹ️</span>
                                <span>Johari Window Theory</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold leading-tight">
                                나도 몰랐던 나의 모습,<br />
                                <span className="text-amber-400">&apos;맹점(Blind Spot)&apos;</span>을 발견했어요
                            </h3>
                            <p className="text-stone-400 text-sm leading-relaxed">
                                조하리의 창(Johari Window) 이론에 따르면,
                                <span className="text-white font-bold"> 나는 모르지만 타인은 아는 영역</span>을
                                &apos;맹점&apos;이라고 합니다. 이 영역을 넓혀갈수록 우리는 더 성장할 수 있습니다.
                            </p>

                            <div className="bg-white/10 rounded-xl p-5 border border-white/5 mt-4">
                                <h4 className="font-bold text-white mb-2 text-sm">{displayName}님의 맹점 발견 ✨</h4>
                                <p className="text-stone-300 text-sm">
                                    <strong className="text-amber-300">긍정적 영향</strong> 항목에서 가장 큰 점수 차이(1.8점)가 발견되었습니다.
                                    {displayName}님은 자신의 에너지를 과소평가하고 있지만, 친구들은 {displayName}님을 <span className="text-white underline decoration-amber-400/50">&quot;주변을 밝히는 사람&quot;</span>으로 인식하고 있습니다.
                                </p>
                            </div>
                        </div>

                        {/* Right: Visual Diagram */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-2 w-full max-w-sm aspect-square bg-stone-800 p-2 rounded-2xl">
                                {/* Open Area */}
                                <div className="bg-stone-700/50 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                                    <span className="text-[10px] text-stone-500 uppercase font-bold mb-1">Me: Know / Others: Know</span>
                                    <span className="text-stone-300 font-bold">열린 창</span>
                                    <span className="text-[10px] text-stone-500">(Open Area)</span>
                                </div>
                                {/* Blind Spot - Highlighted */}
                                <div className="bg-amber-500 text-stone-900 rounded-xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden shadow-lg shadow-amber-900/20 transform scale-105 transition-transform hover:scale-110 duration-300 ring-4 ring-stone-900">
                                    <span className="text-[10px] text-amber-800/70 uppercase font-bold mb-1">Me: Don&apos;t Know / Others: Know</span>
                                    <span className="font-bold text-lg">맹점</span>
                                    <span className="text-[10px] text-amber-900/60 font-bold">(Blind Spot)</span>
                                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-50"></div>
                                </div>
                                {/* Hidden Area */}
                                <div className="bg-stone-700/50 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                                    <span className="text-[10px] text-stone-500 uppercase font-bold mb-1">Me: Know / Others: Don&apos;t Know</span>
                                    <span className="text-stone-300 font-bold">숨겨진 창</span>
                                    <span className="text-[10px] text-stone-500">(Hidden Area)</span>
                                </div>
                                {/* Unknown Area */}
                                <div className="bg-stone-700/50 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                                    <span className="text-[10px] text-stone-500 uppercase font-bold mb-1">Me: Don&apos;t Know / Others: Don&apos;t Know</span>
                                    <span className="text-stone-300 font-bold">미지의 창</span>
                                    <span className="text-[10px] text-stone-500">(Unknown Area)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>


                {/* 4. Detailed Text Feedback (Grouped by Question) */}
                <div className="mb-20 space-y-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-stone-900 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-stone-900">도착한 마음들</h2>
                    </div>

                    {realFeedbackGroups.map((group, groupIndex) => (
                        <div key={group.id} className="relative">
                            {/* Question Header */}
                            <div className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur py-4 mb-4 border-b border-stone-200">
                                <h3 className="text-lg md:text-xl font-bold text-stone-800 leading-relaxed">
                                    <span className="text-amber-600 mr-2">Q{groupIndex + 1}.</span>
                                    {group.question}
                                </h3>
                            </div>

                            {/* Answers Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {group.answers.map((answer, answerIndex) => (
                                    <motion.div
                                        key={answerIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: answerIndex * 0.1 }}
                                        className="bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <span className="text-4xl text-stone-100 mb-4 block">❝</span>
                                        <p className="text-stone-700 leading-relaxed font-medium mb-6 min-h-[4rem]">
                                            &quot;{answer.text}&quot;
                                        </p>

                                        <div className="flex items-center gap-3 border-t border-stone-50 pt-4 mt-auto">
                                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-xs">
                                                {answer.author[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-stone-900">{answer.author}</span>
                                                <span className="text-xs text-stone-400">{answer.relation}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 5. Footer CTA */}
                <div className="text-center space-y-8 border-t border-stone-200 pt-16">
                    <div>
                        <h3 className="text-xl font-bold text-stone-900 mb-2">친구들의 마음에 답장을 보내보세요</h3>
                        <p className="text-stone-500">따뜻한 응원에 대한 감사는 관계를 더 단단하게 만듭니다.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                            <span>❤️</span>
                            감사 편지 쓰기
                        </button>
                        <button className="px-8 py-4 bg-white border border-stone-200 text-stone-700 rounded-xl font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                            <span>⬇️</span>
                            이미지로 저장
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

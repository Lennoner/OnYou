"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Send, Sparkles, User, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface HistoryItem {
    id: string;
    type: "FEEDBACK" | "LETTER";
    date: string;
    content: string; // Summary or full text
    direction: "RECEIVED" | "SENT";
}

interface FriendDetail {
    id: string;
    name: string;
    relation: string;
    type: "USER" | "GUEST";
    history: HistoryItem[];
}

export default function FriendDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [friend, setFriend] = useState<FriendDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock Data Fetching for MVP
        // In real implementation, this would be GET /api/friends/[id]
        // But since we want to show immediate interaction, let's mock the data based on ID for now,
        // or actually fetch if we update the API.
        // Let's implement the API fetch roughly.

        async function fetchData() {
            try {
                // Determine if Guest or User based on ID format or just try to find
                // For now, we will simulate the data structure users expect.

                // Simulating API delay
                await new Promise(r => setTimeout(r, 500));

                setFriend({
                    id: params.id,
                    name: "친구", // Would be fetched
                    relation: "친구",
                    type: "USER",
                    history: [
                        {
                            id: "f1",
                            type: "FEEDBACK",
                            date: "2024.01.24",
                            content: "너는 정말 열정적인 사람이야. 특히...",
                            direction: "RECEIVED"
                        },
                        {
                            id: "l1",
                            type: "LETTER",
                            date: "2024.01.20",
                            content: "저번에 고마웠어!",
                            direction: "SENT"
                        }
                    ]
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params.id]);

    if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading...</div>;
    if (!friend) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">친구를 찾을 수 없습니다.</div>;

    return (
        <div className="min-h-screen bg-stone-50 md:p-10">
            <div className="max-w-2xl mx-auto bg-white min-h-[80vh] md:rounded-3xl shadow-sm border border-stone-200 overflow-hidden">

                {/* Header */}
                <div className="bg-stone-900 text-white p-6 relative">
                    <button onClick={() => router.back()} className="absolute top-6 left-6 hover:opacity-80">
                        <ArrowLeft />
                    </button>
                    <div className="flex flex-col items-center mt-4">
                        <div className="w-20 h-20 bg-stone-700 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-4 border-stone-800">
                            {friend.name[0]}
                        </div>
                        <h1 className="text-2xl font-bold">{friend.name}</h1>
                        <span className="text-stone-400 text-sm mt-1">{friend.relation}</span>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="p-6 grid grid-cols-3 gap-3 border-b border-stone-100 bg-stone-50">
                    <button
                        onClick={() => toast.info("준비 중: 친구에게 피드백 요청 알림 보내기")}
                        className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mb-1">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-xs">피드백 요청</span>
                    </button>

                    <Link
                        href={`/friends/${friend.id}/evaluate`}
                        className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
                            <MessageSquare size={20} />
                        </div>
                        <span className="text-xs">지지적 피드백</span>
                    </Link>

                    <Link
                        href={`/letters?to=${encodeURIComponent(friend.name)}`}
                        className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-1">
                            <Send size={20} />
                        </div>
                        <span className="text-xs">감사 편지</span>
                    </Link>
                </div>

                {/* History */}
                <div className="p-6">
                    <h2 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
                        <Calendar size={18} /> 히스토리
                    </h2>

                    <div className="space-y-6">
                        {friend.history.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full ${item.direction === 'RECEIVED' ? 'bg-amber-400' : 'bg-stone-300'}`}></div>
                                    <div className="w-0.5 flex-1 bg-stone-100 my-1"></div>
                                </div>
                                <div className="pb-4 flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.type === 'FEEDBACK' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {item.type === 'FEEDBACK' ? 'Feedback' : 'Letter'}
                                        </span>
                                        <span className="text-xs text-stone-400">{item.date}</span>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-xl text-sm text-stone-600 leading-relaxed hover:bg-stone-100 transition-colors cursor-pointer">
                                        "{item.content}"
                                    </div>
                                    <div className="mt-1 text-xs text-stone-400 font-medium text-right">
                                        {item.direction === 'RECEIVED' ? 'From Friend' : 'To Friend'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    UserPlus,
    Sparkles,
    Send,
    MoreHorizontal,
    Heart,
    Share2,
    Copy,
    CheckCircle2,
    ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Interface defined above
interface Friend {
    id: string;
    name: string;
    avatar: string;
    relation: string;
    tags: string[];
    closeness: number;
    lastInteraction: string;
    type?: "USER" | "GUEST";
    color?: string; // Derived on frontend
}

export function PeerSurvey() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [copied, setCopied] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await fetch('/api/friends');
                const result = await res.json();

                if (!result.success) {
                    throw new Error(result.error?.message || 'Failed to fetch friends');
                }

                // Add color logic client-side purely for UI flavor
                const coloredData = result.data.map((f: any, i: number) => ({
                    ...f,
                    color: ["bg-blue-50 text-blue-600", "bg-purple-50 text-purple-600", "bg-orange-50 text-orange-600", "bg-rose-50 text-rose-600", "bg-teal-50 text-teal-600"][i % 5]
                }));

                setFriends(coloredData);
            } catch (err) {
                console.error(err);
                toast.error("친구 목록을 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFriends();
    }, []);

    const handleCopyLink = () => {
        setCopied(true);
        toast.success("초대 링크가 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredFriends = friends.filter(friend =>
        friend.name?.includes(searchTerm) ||
        friend.relation?.includes(searchTerm) ||
        friend.tags?.some(tag => tag.includes(searchTerm))
    );

    return (
        <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <div className="w-2 h-2 bg-stone-900 rounded-full"></div>
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Connections</span>
                    </motion.div>
                    <h1 className="text-4xl font-serif text-stone-900 leading-tight">
                        나의 우주, <br /><span className="text-stone-400 italic">함께하는 사람들</span>
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="이름 또는 태그 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all font-medium"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                </div>
            </div>

            {/* --- Invite Banner (CTA) --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-12 relative overflow-hidden rounded-2xl bg-[#1C1917] text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-stone-200/50"
            >
                {/* Background Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0"></div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-serif mb-2 flex items-center gap-2">
                        <Sparkles size={24} className="text-yellow-400" />
                        새로운 별을 발견하세요
                    </h2>
                    <p className="text-stone-400 text-sm max-w-md leading-relaxed">
                        친구를 초대하여 서로의 숨겨진 가치를 찾아주세요. <br className="hidden md:block" />
                        함께 기록할수록 당신의 우주는 더 넓어집니다.
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                    <button
                        onClick={handleCopyLink}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-stone-100 transition-colors active:scale-95"
                    >
                        {copied ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} />}
                        {copied ? "복사 완료!" : "초대 링크 복사"}
                    </button>
                    <button className="p-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white">
                        <Share2 size={20} />
                    </button>
                </div>
            </motion.div>

            {/* --- Friends Grid --- */}
            <div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <span className="loading loading-spinner text-stone-300">Loading...</span>
                    </div>
                ) : filteredFriends.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFriends.map((friend, idx) => (
                            <motion.div
                                key={friend.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.05) }}
                                className="group bg-white border border-stone-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-stone-100 hover:border-stone-200 transition-all duration-300 flex flex-col cursor-pointer"
                                onClick={() => router.push(`/friends/${friend.id}`)}
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-stone-100 flex items-center justify-center">
                                            {friend.avatar ? (
                                                <Image
                                                    src={friend.avatar}
                                                    alt={friend.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-lg font-bold text-stone-400">
                                                    {friend.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-stone-900 text-lg">{friend.name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${friend.color}`}>
                                                {friend.relation}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-stone-300 hover:text-stone-600 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                {/* Tags/Keywords */}
                                <div className="flex gap-2 mb-6">
                                    {friend.tags.map(tag => (
                                        <span key={tag} className="text-xs text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100 font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Interaction Stats (Flavor text) */}
                                <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between text-xs text-stone-400 font-medium">
                                    <span>마지막 교류: {friend.lastInteraction}</span>
                                    <span className="flex items-center gap-1 group-hover:text-amber-500 transition-colors">
                                        상세보기 <ChevronRight size={12} />
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add New Friend Card (Grid Filler) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[240px] hover:bg-stone-50/50 hover:border-stone-300 transition-all cursor-pointer group"
                            onClick={handleCopyLink}
                        >
                            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:scale-110 transition-transform duration-300">
                                <UserPlus size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-500 mb-1">새로운 친구 초대</h3>
                                <p className="text-xs text-stone-400">더 많은 가치를 발견해보세요</p>
                            </div>
                        </motion.div>

                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-stone-400">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>

        </div>
    );
}


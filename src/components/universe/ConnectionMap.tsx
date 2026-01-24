"use client";

import React, { useState } from "react";
import Image from "next/image";

// Types
interface FriendNode {
    id: string;
    name: string;
    avatar: string;
    relation: string;
    closeness: number;
    status: "online" | "offline";
    lastInteraction: string;
}

// Mock Data
const ME = {
    id: "me",
    name: "나",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
};

export function ConnectionMap() {
    const [selectedFriend, setSelectedFriend] = useState<FriendNode | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [friends, setFriends] = useState<FriendNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await fetch('/api/friends');
                if (!res.ok) throw new Error('Err');
                const data = await res.json();

                const nodes: FriendNode[] = data.map((f: any) => ({
                    id: f.id,
                    name: f.name,
                    avatar: f.avatar,
                    relation: f.relation,
                    closeness: f.closeness || 50,
                    status: Math.random() > 0.5 ? "online" : "offline",
                    lastInteraction: f.lastInteraction || "Recently",
                }));

                setFriends(nodes);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFriends();
    }, []);

    const getPosition = (index: number, total: number, closeness: number) => {
        if (total === 0) return { x: 0, y: 0 };
        const angle = (index / total) * 2 * Math.PI;
        const maxRadius = 300;
        const minRadius = 120;
        const normalizedDistance = 1 - (closeness / 100);
        const radius = minRadius + (normalizedDistance * (maxRadius - minRadius));
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <p className="text-stone-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-screen bg-stone-50 overflow-hidden flex items-center justify-center">

            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Main Connection Area */}
            <div className="relative w-[800px] h-[800px] z-10 flex items-center justify-center">

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {friends.map((friend, i) => {
                        const pos = getPosition(i, friends.length, friend.closeness);
                        const center = { x: 400, y: 400 };
                        const target = { x: 400 + pos.x, y: 400 + pos.y };

                        return (
                            <g key={`line-${friend.id}`}>
                                <line
                                    x1={center.x} y1={center.y}
                                    x2={target.x} y2={target.y}
                                    stroke={friend.closeness > 70 ? "#fbbf24" : "#e7e5e4"}
                                    strokeWidth={friend.closeness > 70 ? 2 : 1}
                                    strokeDasharray={friend.closeness < 50 ? "5,5" : "0"}
                                    className="transition-all duration-500"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Center Node (ME) */}
                <div className="absolute z-20 w-24 h-24 rounded-full bg-white shadow-xl shadow-amber-200/50 flex items-center justify-center border-4 border-white ring-4 ring-amber-100">
                    <Image src={ME.avatar} alt="Me" fill className="rounded-full object-cover" sizes="96px" />
                    <div className="absolute -bottom-8 bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                        나 (Center)
                    </div>
                </div>

                {/* Friend Nodes */}
                {friends.map((friend, i) => {
                    const pos = getPosition(i, friends.length, friend.closeness);

                    return (
                        <button
                            key={friend.id}
                            className={`absolute w-16 h-16 rounded-full shadow-lg border-2 transition-transform hover:scale-110 z-20 flex flex-col items-center justify-center
                                ${selectedFriend?.id === friend.id ? "ring-4 ring-rose-200 border-rose-400" : "border-white"}
                                bg-white
                            `}
                            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                            onClick={() => setSelectedFriend(friend)}
                        >
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image src={friend.avatar} alt={friend.name} fill className="object-cover" sizes="64px" />
                                {friend.status === "online" && (
                                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            <div className="absolute -bottom-6 w-24 text-center">
                                <p className="text-sm font-bold text-stone-800 truncate">{friend.name}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Floating UI: Add Friend */}
            <div className="absolute top-8 right-8 z-30">
                <button
                    onClick={() => setIsAddMode(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-full shadow-lg hover:bg-stone-800 transition-all font-bold"
                >
                    + 친구 추가
                </button>
            </div>

            {/* Side Panel: Friend Details (Simplified) */}
            {selectedFriend && (
                <div className="absolute top-0 right-0 h-full w-full md:w-[400px] bg-white/90 backdrop-blur-xl border-l border-stone-200 shadow-2xl z-40 p-8 overflow-y-auto">
                    <button
                        onClick={() => setSelectedFriend(null)}
                        className="absolute top-6 right-6 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
                    >
                        ✕
                    </button>

                    <div className="mt-8 flex flex-col items-center text-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                            <Image src={selectedFriend.avatar} alt={selectedFriend.name} fill className="object-cover" sizes="96px" />
                        </div>
                        <h2 className="text-2xl font-bold text-stone-900">{selectedFriend.name}</h2>
                        <p className="text-stone-500 font-medium mb-6">{selectedFriend.relation}</p>

                        <div className="flex gap-2 mb-8">
                            <button className="flex-1 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-rose-100 transition-colors">
                                ❤️ 마음 보내기
                            </button>
                            <button className="flex-1 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-amber-100 transition-colors">
                                ⚡ 피드백 요청
                            </button>
                        </div>

                        {/* Stats Card */}
                        <div className="w-full bg-stone-50 rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-bold text-stone-500">관계 온도</span>
                                <span className="text-lg font-bold text-rose-500">{selectedFriend.closeness}℃</span>
                            </div>
                            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-rose-400"
                                    style={{ width: `${selectedFriend.closeness}%` }}
                                />
                            </div>
                            <p className="text-xs text-stone-400 mt-3 text-left">
                                최근 활동: {selectedFriend.lastInteraction}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Friend Modal (Simplified) */}
            {isAddMode && (
                <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-stone-900">새로운 친구 연결</h2>
                            <button onClick={() => setIsAddMode(false)} className="p-1 hover:bg-stone-100 rounded-full">
                                ✕
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="아이디 또는 이메일 검색"
                                className="w-full pl-4 pr-4 py-4 bg-stone-50 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                                👤
                            </div>
                            <p className="text-stone-400 text-sm">
                                OnYou를 사용 중인 친구를 찾아<br />서로의 가치를 발견해보세요.
                            </p>
                        </div>

                        <button className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800">
                            초대 링크 복사하기
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

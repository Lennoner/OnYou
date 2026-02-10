"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);
    const [nickname, setNickname] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setNickname(data.name || "");
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchUser();
    }, []);

    const handleSaveNickname = async () => {
        if (!nickname.trim()) {
            toast.error("닉네임을 입력해주세요");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nickname.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                setUser(prev => prev ? { ...prev, name: data.name } : null);
                setIsEditing(false);
                toast.success("닉네임이 변경되었습니다");
            } else {
                toast.error("변경에 실패했습니다");
            }
        } catch (e) {
            toast.error("오류가 발생했습니다");
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="h-full flex items-center justify-center">
                <span className="text-stone-400">로딩 중...</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto p-6 md:p-10 max-w-[800px] mx-auto scrollbar-hide">

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
                    설정
                </h1>
                <p className="text-stone-500 mt-2">계정 및 앱 설정을 관리하세요</p>
            </motion.header>

            {/* Profile Card */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mb-6"
            >
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
                    프로필
                </h2>

                <div className="flex items-center gap-6 mb-8">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center text-3xl overflow-hidden">
                        {user?.image ? (
                            <Image src={user.image} alt="avatar" width={80} height={80} className="w-full h-full object-cover" />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    maxLength={20}
                                    className="flex-1 px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg"
                                    placeholder="닉네임 입력"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveNickname}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? "저장 중..." : "저장"}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setNickname(user?.name || "");
                                    }}
                                    className="px-4 py-2 text-stone-500 hover:text-stone-700 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold text-stone-900">
                                        {user?.name || "사용자"}
                                    </h3>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-stone-400 hover:text-stone-600 transition-colors text-sm"
                                    >
                                        ✏️ 수정
                                    </button>
                                </div>
                                <p className="text-stone-500 mt-1">{user?.email || session?.user?.email}</p>
                            </>
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Account Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mb-6"
            >
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
                    계정
                </h2>

                <div className="space-y-4">
                    {/* Login Method */}
                    <div className="flex items-center justify-between py-4 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🔐</span>
                            <div>
                                <p className="font-medium text-stone-900">로그인 방식</p>
                                <p className="text-sm text-stone-500">
                                    {session?.user?.email?.includes('@') ? 'Demo 계정' : 'Google'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="flex items-center justify-between py-4 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📧</span>
                            <div>
                                <p className="font-medium text-stone-900">이메일</p>
                                <p className="text-sm text-stone-500">{session?.user?.email || user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Danger Zone */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100"
            >
                <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-6">
                    계정 관리
                </h2>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-stone-50 text-stone-600 rounded-2xl font-medium hover:bg-stone-100 transition-colors"
                >
                    <span className="text-xl">🚪</span>
                    로그아웃
                </button>
            </motion.section>

            {/* Version Info */}
            <div className="mt-8 text-center text-stone-400 text-sm">
                OnYou v0.1.0
            </div>
        </div>
    );
}

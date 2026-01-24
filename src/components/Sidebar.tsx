"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();

    const mainNav = [
        { id: "home", label: "홈", icon: "🏠", href: "/" },
        { id: "discover", label: "나의 발견", icon: "✨", href: "/discover" },
        { id: "letters", label: "감사쪽지", icon: "💌", href: "/letters" },
        { id: "settings", label: "설정", icon: "⚙️", href: "/settings" },
    ];

    const subNav = [
        { id: "universe", label: "나의 우주", icon: "🌍", href: "/universe" },
        { id: "friends", label: "친구 목록", icon: "👥", href: "/friends" },
    ];

    return (
        <aside className="w-[260px] h-full flex flex-col bg-[#FDFCF8] border-r border-stone-200 hidden md:flex sticky top-0 z-50">

            {/* Brand */}
            <div className="p-8 pb-10">
                <Link href="/" className="cursor-pointer group inline-block">
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                        OnYou
                    </h1>
                    <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase mt-1">
                        Discover Yourself
                    </p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-8 overflow-y-auto scrollbar-hide">

                {/* Main Menu */}
                <div>
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 px-3">
                        메인 메뉴
                    </h3>
                    <ul className="space-y-1">
                        {mainNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                            isActive
                                                ? "bg-stone-100 text-stone-900 font-bold"
                                                : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                                        )}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm">{item.label}</span>

                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Sub Menu - Connection Section */}
                <div>
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 px-3">
                        연결
                    </h3>
                    <ul className="space-y-1">
                        {subNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                            isActive
                                                ? "bg-stone-100 text-stone-900 font-bold"
                                                : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                                        )}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm">{item.label}</span>

                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-stone-100">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-stone-400 hover:text-stone-600 transition-colors group rounded-xl hover:bg-stone-50">
                    <span className="text-lg">🚪</span>
                    <span className="text-sm font-medium">로그아웃</span>
                </button>
            </div>

        </aside>
    );
}

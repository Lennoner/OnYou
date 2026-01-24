"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { id: "home", label: "홈", icon: "🏠", href: "/" },
        { id: "discover", label: "발견", icon: "✨", href: "/discover" },
        { id: "universe", label: "우주", icon: "🌍", href: "/universe" },
        { id: "friends", label: "친구", icon: "👥", href: "/friends" },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
            <nav className="bg-stone-900/90 backdrop-blur-md text-stone-400 rounded-full px-6 py-4 shadow-2xl flex justify-between items-center border border-white/10 ring-1 ring-black/5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-colors relative",
                                isActive ? "text-amber-400" : "hover:text-stone-200"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-full transition-all text-xl",
                                isActive ? "bg-white/10" : ""
                            )}>
                                {item.icon}
                            </div>
                            {isActive && (
                                <span className="absolute -bottom-2 w-1 h-1 bg-amber-400 rounded-full"></span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

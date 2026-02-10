"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SignIn() {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#FAFAF9]">
            {/* Left Side - Hero/Branding */}
            <div className="relative hidden md:flex flex-col justify-center p-12 lg:p-20 bg-stone-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#444" />
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 max-w-lg"
                >
                    <h1 className="text-6xl font-serif font-bold mb-6 leading-tight">
                        Discover<br />
                        <span className="text-amber-400">yourself.</span>
                    </h1>
                    <p className="text-xl text-stone-400 leading-relaxed">
                        타인의 시선으로 나를 발견하고,<br />
                        새로운 연결을 시작해보세요.
                    </p>
                </motion.div>

                {/* Decorative Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-amber-500/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-500/20 blur-[100px] rounded-full"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-20">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">환영합니다</h2>
                        <p className="text-stone-500">OnYou 계정으로 로그인하세요.</p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-stone-200 rounded-2xl hover:bg-stone-50 transition-all group"
                        >
                            <Image
                                src="https://authjs.dev/img/providers/google.svg"
                                alt="Google"
                                width={24}
                                height={24}
                                className="w-6 h-6 group-hover:scale-110 transition-transform"
                            />
                            <span className="font-medium text-stone-600">Google로 계속하기</span>
                        </button>

                        <button
                            onClick={() => signIn("kakao", { callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#FEE500] rounded-2xl hover:bg-[#FDD800] transition-all"
                        >
                            <span className="text-xl">💬</span>
                            <span className="font-medium text-stone-900">카카오로 계속하기</span>
                        </button>
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#FAFAF9] text-stone-400">또는</span>
                        </div>
                    </div>

                    {/* Test Account Login (Optional for Dev/Demo) */}
                    <button
                        onClick={() => signIn("credentials", { email: "test@example.com", callbackUrl: "/" })}
                        className="w-full py-4 text-stone-400 text-sm hover:text-stone-600 underline transition-colors"
                    >
                        게스트 체험하기 (Demo)
                    </button>

                    <p className="text-xs text-center text-stone-400 mt-8">
                        로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

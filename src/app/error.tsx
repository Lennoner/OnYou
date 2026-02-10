'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 max-w-md w-full"
            >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                    🚨
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">
                    오류가 발생했습니다
                </h2>
                <p className="text-stone-500 mb-8 leading-relaxed">
                    죄송합니다. 페이지를 불러오는 중에 문제가 생겼습니다.<br />
                    잠시 후 다시 시도해주세요.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 border border-stone-200 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                        홈으로 가기
                    </button>
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

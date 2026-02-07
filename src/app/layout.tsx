import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
    title: "OnYou - 타인의 눈으로 발견하는 나",
    description: "Identify your true self through the eyes of others.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
            </head>
            <body className="flex h-screen w-full overflow-hidden bg-[#FAFAF9] text-[#1C1917] font-serif">
                {/* Texture Overlay */}
                <div className="pointer-events-none fixed inset-0 opacity-[0.03] z-[100]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                </div>

                <Sidebar />

                <main className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Ambient Light */}
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-amber-100/40 to-rose-100/30 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex-1 overflow-y-auto z-10 w-full h-full pb-24 md:pb-0">
                        {children}
                    </div>
                </main>
                <MobileNav />
                <Toaster position="top-center" />
            </body>
        </html>
    );
}

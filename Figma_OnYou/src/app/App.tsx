import React, { useState } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { Dashboard } from "@/app/components/Dashboard";
import { AnalysisResult } from "@/app/components/AnalysisResult"; // Report
import { LetterWriter } from "@/app/components/LetterWriter"; // Letters
import { ConnectionMap } from "@/app/components/ConnectionMap"; // Universe
import { PeerSurvey } from "@/app/components/PeerSurvey"; // Friends List
import { InviteCreator } from "@/app/components/InviteCreator"; // Invite
import { Discover } from "@/app/components/Discover"; // Discover (Self Survey + Report)

export default function App() {
  const [currentView, setCurrentView] = useState("home");

  return (
    <div className="flex h-screen w-full bg-[#FAFAF9] text-[#1C1917] font-sans overflow-hidden selection:bg-stone-200 selection:text-stone-900">
      {/* Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] z-[100]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Ambient Light */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-amber-100/40 to-rose-100/30 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto z-10 w-full h-full">
           {currentView === "home" && <Dashboard setCurrentView={setCurrentView} />}
           {currentView === "discover" && <Discover />} 
           {currentView === "letters" && <LetterWriter />}
           {currentView === "universe" && <ConnectionMap />}
           {currentView === "friends" && <PeerSurvey />}
           {currentView === "invite" && <InviteCreator />}
           {currentView === "settings" && (
             <div className="flex flex-col items-center justify-center h-full text-stone-400">
                <SettingsPlaceholder />
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="text-center p-8 bg-white rounded-3xl border border-stone-200 shadow-sm">
      <h2 className="text-xl font-bold text-stone-900 mb-2">설정</h2>
      <p className="text-stone-500">계정 및 알림 설정을 준비 중입니다.</p>
    </div>
  )
}

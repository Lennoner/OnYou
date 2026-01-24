import React from "react";
import { motion } from "motion/react";
import { 
  ArrowUpRight, 
  Sparkles, 
  GitGraph, 
  BookOpen, 
  Mail, 
  Send,
  Users,
  CheckCircle2,
  Share2
} from "lucide-react";

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  // Mock State for "What to do next" logic
  // Scenario: Feedback arrived but not all done
  const activityState = {
    hasFeedback: true,
    newFeedbackCount: 2,
    totalInvited: 5,
    responseCount: 3
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-10 max-w-[1400px] mx-auto scrollbar-hide">
      
      {/* Header */}
      <header className="mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
              반가워요, <br/>
              <span className="text-stone-400 italic">지수님.</span>
            </h1>
          </div>
          <div className="hidden md:block text-right">
             <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-bold mb-2">
                Today's Value
             </span>
             <p className="text-stone-600 font-medium">"관계 속에서 새로운 나를 발견하는 하루"</p>
          </div>
        </motion.div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
        
        {/* [1] Priority Action Card (Dynamic State) */}
        {/* Scenario 3: New Feedback Arrived */}
        <motion.div 
          onClick={() => setCurrentView("discover")}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-[#1C1917] rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-stone-200"
        >
          <div className="absolute top-0 right-0 p-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/30 transition-all duration-500"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[240px]">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-amber-400 animate-pulse">
                <Sparkles size={24} />
              </div>
              <div className="flex items-center gap-2 text-stone-400 group-hover:text-white transition-colors">
                <span className="text-sm font-bold">확인하기</span>
                <ArrowUpRight size={18} />
              </div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-amber-500/30">
                 🎉 새로운 발견
              </div>
              <h2 className="text-3xl font-bold mb-2">2개의 새로운 피드백 도착!</h2>
              <p className="text-stone-400 max-w-md mb-4">
                친구들이 지수님의 숨겨진 매력을 발견했어요.<br/>
                지금 바로 내가 생각한 나(Self)와 비교해보세요.
              </p>
              
              {/* Progress Bar */}
              <div className="max-w-sm">
                 <div className="flex justify-between text-xs text-stone-500 mb-1">
                   <span>진행률 ({activityState.responseCount}/{activityState.totalInvited})</span>
                   <span>60%</span>
                 </div>
                 <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full w-[60%]"></div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* [2] Quick Action: Invite (Always visible secondary priority) */}
        <motion.div 
          onClick={() => setCurrentView("invite")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-stone-200 rounded-3xl p-8 flex flex-col justify-between group cursor-pointer hover:border-stone-900 hover:shadow-lg transition-all"
        >
          <div className="flex justify-between items-start">
             <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
               <Share2 size={24} />
             </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold text-stone-900 mb-2">지인 초대하기</h3>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              더 많은 친구들에게<br/>나의 가치를 물어보세요.
            </p>
            <button className="w-full py-3 border border-stone-200 rounded-xl font-bold text-sm text-stone-600 group-hover:bg-stone-50 transition-colors">
              초대장 만들기
            </button>
          </div>
        </motion.div>

        {/* [3] My Universe (Network) */}
        <motion.div 
          onClick={() => setCurrentView("universe")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-stone-100 rounded-3xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-stone-200 transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
               <GitGraph size={28} className="text-stone-900" />
               <span className="text-xs font-bold bg-white px-2 py-1 rounded text-stone-500 shadow-sm">Updated</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900">나의 우주</h3>
            <p className="text-stone-500 text-sm">5개의 별과 연결되어 있습니다.</p>
          </div>
          
          <div className="relative z-10 mt-6 flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full bg-stone-300 border-2 border-stone-100"></div>
             ))}
             <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-stone-100 flex items-center justify-center text-[10px] text-white font-bold">+2</div>
          </div>
        </motion.div>

        {/* [4] Gratitude Letter (Secondary Action) */}
        <motion.div 
          onClick={() => setCurrentView("letters")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 bg-white border border-stone-200 rounded-3xl p-8 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
        >
           <div className="flex items-center gap-6">
             <div className="p-4 bg-rose-50 rounded-2xl text-rose-500">
               <Mail size={24} />
             </div>
             <div>
               <h3 className="text-xl font-bold text-stone-900">감사 쪽지</h3>
               <p className="text-stone-500 text-sm">소중한 사람에게 닿을 엽서 쓰기</p>
             </div>
           </div>
           <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-stone-50 text-stone-900 rounded-xl font-bold text-sm hover:bg-stone-900 hover:text-white transition-colors">
             작성하기 <Send size={14} />
           </button>
        </motion.div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Plus, Search, X, Heart, Mail, Sparkles, MoreVertical, Zap } from "lucide-react";

// Types
interface FriendNode {
  id: string;
  name: string;
  avatar: string;
  relation: string;
  closeness: number; // 1-100 (determines distance)
  status: "online" | "offline";
  lastInteraction: string;
}

// Mock Data
const ME = {
  id: "me",
  name: "나",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
};

const INITIAL_FRIENDS: FriendNode[] = [
  { id: "1", name: "민수", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop", relation: "고등학교 동창", closeness: 90, status: "online", lastInteraction: "3일 전 편지 받음" },
  { id: "2", name: "지영", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", relation: "대학 동기", closeness: 75, status: "offline", lastInteraction: "1주 전 피드백 줌" },
  { id: "3", name: "현우", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", relation: "직장 동료", closeness: 60, status: "online", lastInteraction: "2주 전 편지 보냄" },
  { id: "4", name: "서연", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop", relation: "스터디 멤버", closeness: 40, status: "offline", lastInteraction: "한달 전 피드백 받음" },
  { id: "5", name: "준호", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop", relation: "동아리", closeness: 30, status: "offline", lastInteraction: "교류 없음" },
];

export function ConnectionMap() {
  const [selectedFriend, setSelectedFriend] = useState<FriendNode | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Calculate positions based on closeness (Radial Layout)
  // Closer friends are nearer to the center (0,0)
  const getPosition = (index: number, total: number, closeness: number) => {
    const angle = (index / total) * 2 * Math.PI; // Distribute in a circle
    const maxRadius = 300; // Max distance from center
    const minRadius = 120; // Min distance
    
    // Invert closeness: higher closeness = smaller radius (closer)
    const normalizedDistance = 1 - (closeness / 100); 
    const radius = minRadius + (normalizedDistance * (maxRadius - minRadius));

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-stone-50 overflow-hidden flex items-center justify-center">
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Main Connection Area */}
      <div className="relative w-[800px] h-[800px] z-10 flex items-center justify-center">
        
        {/* SVG Connections Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {INITIAL_FRIENDS.map((friend, i) => {
            const pos = getPosition(i, INITIAL_FRIENDS.length, friend.closeness);
            const center = { x: 400, y: 400 }; // SVG center
            const target = { x: 400 + pos.x, y: 400 + pos.y };
            
            return (
              <g key={`line-${friend.id}`}>
                {/* Base Line */}
                <line 
                  x1={center.x} y1={center.y} 
                  x2={target.x} y2={target.y} 
                  stroke={friend.closeness > 70 ? "#fbbf24" : "#e7e5e4"} 
                  strokeWidth={friend.closeness > 70 ? 2 : 1}
                  strokeDasharray={friend.closeness < 50 ? "5,5" : "0"}
                  className="transition-all duration-500"
                />
                
                {/* Animated Particle for close friends (Simulating active connection) */}
                {friend.closeness > 60 && (
                  <motion.circle 
                    r="3" 
                    fill="#fbbf24"
                    animate={{
                      cx: [center.x, target.x],
                      cy: [center.y, target.y]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "reverse"
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Center Node (ME) */}
        <motion.div 
          className="absolute z-20 w-24 h-24 rounded-full bg-white shadow-xl shadow-amber-200/50 flex items-center justify-center border-4 border-white ring-4 ring-amber-100"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={ME.avatar} alt="Me" className="w-full h-full rounded-full object-cover" />
          <div className="absolute -bottom-8 bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full">
            나 (Center)
          </div>
        </motion.div>

        {/* Friend Nodes */}
        {INITIAL_FRIENDS.map((friend, i) => {
          const pos = getPosition(i, INITIAL_FRIENDS.length, friend.closeness);
          
          return (
            <motion.button
              key={friend.id}
              className={`absolute w-16 h-16 rounded-full shadow-lg border-2 transition-transform hover:scale-110 z-20 flex flex-col items-center justify-center
                ${selectedFriend?.id === friend.id ? "ring-4 ring-rose-200 border-rose-400" : "border-white"}
                bg-white
              `}
              style={{ x: pos.x, y: pos.y }} // Relative to center due to flex items-center justify-center of parent
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              onClick={() => setSelectedFriend(friend)}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                {/* Status Indicator */}
                {friend.status === "online" && (
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="absolute -bottom-6 w-24 text-center">
                <p className="text-sm font-bold text-stone-800 truncate">{friend.name}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Floating UI: Add Friend */}
      <div className="absolute top-8 right-8 z-30">
        <button 
          onClick={() => setIsAddMode(true)}
          className="flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-full shadow-lg hover:bg-stone-800 transition-all font-bold"
        >
          <Plus size={18} />
          친구 추가
        </button>
      </div>

      {/* Side Panel: Friend Details */}
      <AnimatePresence>
        {selectedFriend && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            className="absolute top-0 right-0 h-full w-full md:w-[400px] bg-white/90 backdrop-blur-xl border-l border-stone-200 shadow-2xl z-40 p-8"
          >
            <button 
              onClick={() => setSelectedFriend(null)}
              className="absolute top-6 right-6 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
            >
              <X size={20} className="text-stone-500" />
            </button>

            <div className="mt-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">{selectedFriend.name}</h2>
              <p className="text-stone-500 font-medium mb-6">{selectedFriend.relation}</p>
              
              <div className="flex gap-2 mb-8">
                <button className="flex-1 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-rose-100 transition-colors">
                  <Heart size={16} /> 마음 보내기
                </button>
                <button className="flex-1 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-amber-100 transition-colors">
                  <Zap size={16} /> 피드백 요청
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

              {/* History List */}
              <div className="w-full text-left">
                <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  함께한 기록
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-xl">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">응원의 편지 보냄</p>
                      <p className="text-xs text-stone-400">2023.10.15</p>
                    </div>
                  </div>
                   <div className="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-xl">
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                      <Zap size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">피드백 도착함</p>
                      <p className="text-xs text-stone-400">2023.09.20</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {isAddMode && (
          <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-900">새로운 친구 연결</h2>
                <button onClick={() => setIsAddMode(false)} className="p-1 hover:bg-stone-100 rounded-full">
                  <X size={20} className="text-stone-400" />
                </button>
              </div>
              
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input 
                  type="text" 
                  placeholder="아이디 또는 이메일 검색"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                  autoFocus
                />
              </div>

              <div className="text-center py-8">
                 <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                   <User size={32} />
                 </div>
                 <p className="text-stone-400 text-sm">
                   OnYou를 사용 중인 친구를 찾아<br/>서로의 가치를 발견해보세요.
                 </p>
              </div>

              <button className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800">
                초대 링크 복사하기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

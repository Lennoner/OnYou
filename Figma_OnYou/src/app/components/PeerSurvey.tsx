import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  UserPlus, 
  Sparkles, 
  Send, 
  MoreHorizontal, 
  Heart,
  Share2,
  Copy,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

// --- Dummy Data ---
const FRIENDS_DATA = [
  {
    id: "1",
    name: "김민준",
    relation: "대학교 동기",
    avatar: "https://images.unsplash.com/photo-1617355453845-6996ffeee4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwa29yZWFuJTIwbWFuJTIwbmF0dXJhbCUyMGxpZ2h0fGVufDF8fHx8MTc2ODk4NjMwM3ww&ixlib=rb-4.1.0&q=80&w=400",
    tags: ["열정적", "성실함"],
    lastInteraction: "2일 전",
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: "2",
    name: "이서연",
    relation: "직장 동료",
    avatar: "https://images.unsplash.com/photo-1676083192960-2a4873858487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwa29yZWFuJTIwd29tYW4lMjBzbWlsZXxlbnwxfHx8fDE3Njg5ODYzMDN8MA&ixlib=rb-4.1.0&q=80&w=400",
    tags: ["창의적", "센스쟁이"],
    lastInteraction: "1주 전",
    color: "bg-purple-50 text-purple-600"
  },
  {
    id: "3",
    name: "박준호",
    relation: "디자인 멘토",
    avatar: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNyZWF0aXZlJTIwcHJvZmVzc2lvbmFsJTIwYXNpYW4lMjBtYW58ZW58MXx8fHwxNzY4OTg2MzAzfDA&ixlib=rb-4.1.0&q=80&w=400",
    tags: ["통찰력", "리더십"],
    lastInteraction: "3일 전",
    color: "bg-orange-50 text-orange-600"
  },
  {
    id: "4",
    name: "최지우",
    relation: "스터디 모임",
    avatar: "https://images.unsplash.com/photo-1729337531424-198f880cb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGZyaWVuZGx5JTIwYXNpYW4lMjB3b21hbiUyMHN0dWRlbnR8ZW58MXx8fHwxNzY4OTg2MzAzfDA&ixlib=rb-4.1.0&q=80&w=400",
    tags: ["긍정적", "에너지"],
    lastInteraction: "방금 전",
    color: "bg-rose-50 text-rose-600"
  },
  {
    id: "5",
    name: "정하늘",
    relation: "고등학교 친구",
    avatar: "https://images.unsplash.com/photo-1582888175787-df1caa0e0001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGFydGlzdGljJTIwYXNpYW4lMjBub24tYmluYXJ5fGVufDF8fHx8MTc2ODk4NjMwM3ww&ixlib=rb-4.1.0&q=80&w=400",
    tags: ["예술가", "자유로움"],
    lastInteraction: "2주 전",
    color: "bg-teal-50 text-teal-600"
  },
];

export function PeerSurvey() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    toast.success("초대 링크가 복사되었습니다!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFriends = FRIENDS_DATA.filter(friend => 
    friend.name.includes(searchTerm) || friend.relation.includes(searchTerm)
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 h-full flex flex-col">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-2 h-2 bg-stone-900 rounded-full"></div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Connections</span>
          </motion.div>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">
            나의 우주, <br/><span className="text-stone-400 italic">함께하는 사람들</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="이름 또는 태그 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        </div>
      </div>

      {/* --- Invite Banner (CTA) --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-12 relative overflow-hidden rounded-2xl bg-[#1C1917] text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-stone-200/50"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-serif mb-2 flex items-center gap-2">
            <Sparkles size={24} className="text-yellow-400" />
            새로운 별을 발견하세요
          </h2>
          <p className="text-stone-400 text-sm max-w-md leading-relaxed">
            친구를 초대하여 서로의 숨겨진 가치를 찾아주세요. <br className="hidden md:block"/>
            함께 기록할수록 당신의 우주는 더 넓어집니다.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <button 
            onClick={handleCopyLink}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-stone-100 transition-colors active:scale-95"
          >
            {copied ? <CheckCircle2 size={18} className="text-green-600"/> : <Copy size={18} />}
            {copied ? "복사 완료!" : "초대 링크 복사"}
          </button>
          <button className="p-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white">
            <Share2 size={20} />
          </button>
        </div>
      </motion.div>

      {/* --- Friends Grid --- */}
      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {filteredFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFriends.map((friend, idx) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (idx * 0.05) }}
                className="group bg-white border border-stone-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-stone-100 hover:border-stone-200 transition-all duration-300 flex flex-col"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg">{friend.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${friend.color}`}>
                        {friend.relation}
                      </span>
                    </div>
                  </div>
                  <button className="text-stone-300 hover:text-stone-600 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Tags/Keywords */}
                <div className="flex gap-2 mb-6">
                  {friend.tags.map(tag => (
                    <span key={tag} className="text-xs text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Interaction Stats (Flavor text) */}
                <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between text-xs text-stone-400 mb-4">
                  <span>마지막 교류: {friend.lastInteraction}</span>
                  <span className="flex items-center gap-1">
                    <Heart size={10} className="fill-stone-300 text-stone-300" /> 
                    Connected
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toast.success(`${friend.name}님에게 피드백 요청을 보냈습니다.`)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-50 text-stone-600 font-bold text-xs hover:bg-stone-100 transition-colors group-hover:bg-white group-hover:border group-hover:border-stone-200"
                  >
                    <Sparkles size={14} className="text-orange-400" />
                    피드백
                  </button>
                  <button 
                    onClick={() => toast.success(`${friend.name}님에게 마음 엽서를 보냅니다.`)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm"
                  >
                    <Send size={14} />
                    마음 배송
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Friend Card (Grid Filler) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[240px] hover:bg-stone-50/50 hover:border-stone-300 transition-all cursor-pointer group"
              onClick={handleCopyLink}
            >
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:scale-110 transition-transform duration-300">
                <UserPlus size={28} />
              </div>
              <div>
                <h3 className="font-bold text-stone-500 mb-1">새로운 친구 초대</h3>
                <p className="text-xs text-stone-400">더 많은 가치를 발견해보세요</p>
              </div>
            </motion.div>

          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-stone-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

    </div>
  );
}

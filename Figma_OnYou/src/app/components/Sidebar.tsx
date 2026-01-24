import React from "react";
import { 
  LayoutGrid, 
  PieChart, 
  Mail, 
  Settings, 
  Globe, 
  Users, 
  LogOut,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  
  const mainNav = [
    { id: "home", label: "홈", icon: LayoutGrid },
    { id: "discover", label: "나의 발견", icon: Sparkles }, // Changed from 'report' to 'discover' as per App.tsx
    { id: "letters", label: "감사쪽지", icon: Mail },
    { id: "settings", label: "설정", icon: Settings },
  ];

  const subNav = [
    { id: "universe", label: "나의 우주", icon: Globe },
    { id: "friends", label: "친구 목록", icon: Users },
  ];

  return (
    <aside className="w-[260px] h-full flex flex-col bg-[#FDFCF8] border-r border-stone-200 hidden md:flex sticky top-0 z-50">
      
      {/* Brand */}
      <div className="p-8 pb-10">
        <div 
          onClick={() => setCurrentView("home")}
          className="cursor-pointer group inline-block"
        >
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
            OnYou.
          </h1>
          <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase mt-1">
            Value Collection
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-8 overflow-y-auto scrollbar-hide">
        
        {/* Main Menu */}
        <div>
          <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3 px-3">
            메인 메뉴
          </h3>
          <div className="space-y-1">
            {mainNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200
                  ${currentView === item.id 
                    ? "bg-stone-900 text-white shadow-md shadow-stone-200" 
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                  }
                `}
              >
                <item.icon size={18} strokeWidth={currentView === item.id ? 2.5 : 2} />
                <span className={`text-sm ${currentView === item.id ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub Menu (Connect) */}
        <div>
          <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3 px-3">
            연결
          </h3>
          <div className="space-y-1">
            {subNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200
                  ${currentView === item.id 
                    ? "bg-amber-100 text-amber-900 font-bold" 
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                  }
                `}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer / Profile */}
      <div className="p-6 border-t border-stone-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden ring-2 ring-transparent group-hover:ring-stone-300 transition-all">
             <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-xs font-bold text-stone-900">Jisoo Kim</span>
            <span className="text-[10px] text-stone-400">Basic Plan</span>
          </div>
          <LogOut size={16} className="text-stone-300 group-hover:text-stone-500" />
        </div>
      </div>
    </aside>
  );
}

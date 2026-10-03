import React from 'react';
import { 
  Layers, 
  Presentation, 
  Terminal, 
  BookOpen, 
  Cpu, 
  Code2, 
  Sparkles, 
  Download 
} from 'lucide-react';

export type ActiveTabType = 'canvas' | 'slides' | 'gcode' | 'graphic-novel' | 'electrochemical' | 'cad-automation';

interface TopNavigationProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onExportReport: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  onExportReport,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 bg-[#0C0C0E]/95 backdrop-blur-md border-b border-[#C35237]/30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C35237] to-[#8F7142] flex items-center justify-center border border-[#00E5FF]/40 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-100" />
        </div>
        <span className="text-sm sm:text-base font-bold tracking-wider text-amber-100 font-display">
          चित्रसूत्र · CHITRASUTRA ENGINE
        </span>
      </div>

      {/* Zone 2: Clean navigation links */}
      <nav className="hidden xl:flex items-center gap-1 bg-[#12141c] p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'canvas'
              ? 'bg-[#C35237]/30 text-amber-200 border border-[#C35237]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Matter.js Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'slides'
              ? 'bg-[#C35237]/30 text-amber-200 border border-[#C35237]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Presentation className="w-3.5 h-3.5 text-amber-400" />
          <span>Master Slide Deck</span>
        </button>

        <button
          onClick={() => setActiveTab('gcode')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'gcode'
              ? 'bg-[#C35237]/30 text-amber-200 border border-[#C35237]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>G-Code Toolpaths</span>
        </button>

        <button
          onClick={() => setActiveTab('graphic-novel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'graphic-novel'
              ? 'bg-[#C35237]/30 text-amber-200 border border-[#C35237]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Assembly Novel</span>
        </button>

        <button
          onClick={() => setActiveTab('electrochemical')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'electrochemical'
              ? 'bg-[#C35237]/30 text-amber-200 border border-[#C35237]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-300" />
          <span>Electrochemical Cell</span>
        </button>

        <button
          onClick={() => setActiveTab('cad-automation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'cad-automation'
              ? 'bg-[#C35237]/30 text-amber-200 border border-[#C35237]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span>CAD Python</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExportReport}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md active:scale-95 whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Blueprint</span>
        </button>
      </div>
    </header>
  );
};

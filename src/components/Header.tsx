import { Sparkles, RefreshCw } from "lucide-react";

type Tab = "editor" | "library" | "history";

interface HeaderProps {
  hasImage: boolean;
  isProcessing: boolean;
  activeTab: Tab;
  onConvert: () => void;
  onGoToWorkspace: () => void;
}

export default function Header({ hasImage, isProcessing, activeTab, onConvert, onGoToWorkspace }: HeaderProps) {
  return (
    <header className="py-6 px-6 sm:px-10 border-b border-[#1E1E20] flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0B0B0C]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4FF0E] bg-slate-900 px-2 py-0.5 border border-[#1E1E20]">SYSTEM 3.5</span>
          <span className="text-[10px] text-slate-500 font-mono">v1.2-LIVE</span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-black uppercase m-0 leading-[0.85] tracking-tighter">
          WIRE2<span className="text-[#C4FF0E]">TXT</span>
        </h1>
        <p className="text-xs text-slate-400 mt-3 max-w-2xl font-mono leading-relaxed">
          Instant visual-to-text converter. Translates screen mockups and wireframes into clean, structured ASCII UI diagrams optimized for text-only Large Language Models.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {hasImage && (
          <button
            onClick={onConvert}
            disabled={isProcessing}
            className="px-6 py-2.5 bg-[#C4FF0E] text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>Generate ASCII</span>
          </button>
        )}

        {activeTab !== "editor" && (
          <button
            onClick={onGoToWorkspace}
            className="px-5 py-2.5 border border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            Go to Workspace
          </button>
        )}
      </div>
    </header>
  );
}

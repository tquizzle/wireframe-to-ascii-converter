interface FooterStats {
  tokens: number;
  timeMs: number;
  componentsCount: number;
}

interface FooterProps {
  hasResult: boolean;
  stats: FooterStats;
}

export default function Footer({ hasResult, stats }: FooterProps) {
  return (
    <footer className="h-auto md:h-[60px] py-4 md:py-0 border-t border-[#1E1E20] flex flex-col md:flex-row items-center px-6 sm:px-10 gap-6 bg-[#09090A] justify-between text-slate-400">
      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C4FF0E] animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-tight text-white">Engine: gemini-3.5-flash</span>
        </div>

        {hasResult && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Latency:</span>
              <span className="text-[10px] font-mono font-bold text-white">{(stats.timeMs / 1000).toFixed(2)}s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Approx Tokens:</span>
              <span className="text-[10px] font-mono font-bold text-white">{stats.tokens}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Detected Items:</span>
              <span className="text-[10px] font-mono font-bold text-[#C4FF0E]">{stats.componentsCount}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-tighter text-slate-600">© 2026 WIRE2TXT_SYSTEMS // OFFLINE CACHE OK</div>
      </div>
    </footer>
  );
}

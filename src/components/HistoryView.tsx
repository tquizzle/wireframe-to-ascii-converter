import { Trash2, History, ChevronRight } from "lucide-react";
import { ConversionHistoryItem } from "../types";

interface HistoryViewProps {
  history: ConversionHistoryItem[];
  onClearHistory: () => void;
  onLoadItem: (item: ConversionHistoryItem) => void;
  onGoToEditor: () => void;
}

export default function HistoryView({ history, onClearHistory, onLoadItem, onGoToEditor }: HistoryViewProps) {
  return (
    <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-[#0E0E10] w-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-6 border-b border-[#1E1E20] pb-4">
          <div>
            <h2 className="text-2xl font-black uppercase mb-1 tracking-tight">Conversion History</h2>
            <p className="text-xs text-slate-400 font-mono">
              Access and reuse previously converted UI designs. Keeps up to 20 past runs locally.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 border border-rose-800 text-rose-300 text-[10px] font-bold uppercase tracking-wider hover:bg-rose-950/40 transition-all flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/5 bg-[#111113]">
            <History className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="font-bold uppercase tracking-tight text-slate-400">No past conversions found</p>
            <p className="text-xs text-slate-500 font-mono mt-1 mb-4">Start by uploading or sketching inside the editor.</p>
            <button
              onClick={onGoToEditor}
              className="px-5 py-2 border border-[#C4FF0E] text-[#C4FF0E] font-bold uppercase text-[10px] tracking-widest hover:bg-[#C4FF0E] hover:text-black transition-colors"
            >
              Go to Editor
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-5 border border-white/5 bg-[#111113] hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  {item.imageBase64 && (
                    <div className="w-16 h-12 bg-black border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0">
                      <img src={item.imageBase64} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm uppercase text-white tracking-tight">{item.uiType}</span>
                      <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 text-slate-400 border border-white/10 uppercase">Style: {item.style}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1 line-clamp-1">{item.layoutSummary}</p>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1">Converted at {item.timestamp} // {item.detectedComponents.length} components detected</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onLoadItem(item)}
                    className="px-4 py-1.5 bg-white text-black text-[10px] font-extrabold uppercase tracking-wider hover:opacity-95 transition-all flex items-center gap-1"
                  >
                    <span>Load Workspace</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

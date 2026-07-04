import { Copy, Check, Download, Maximize2, Minimize2, FileText, RefreshCw } from "lucide-react";
import { ConversionResult } from "../types";
import ComponentTable from "./ComponentTable";
import Skeleton from "./Skeleton";

interface AsciiDisplayProps {
  conversionResult: ConversionResult | null;
  isProcessing: boolean;
  copiedAscii: boolean;
  copiedPrompt: boolean;
  onCopyAscii: () => void;
  onCopyPrompt: () => void;
  onDownload: () => void;
  isAsciiFullscreen: boolean;
  setIsAsciiFullscreen: (v: boolean) => void;
}

export default function AsciiDisplay({
  conversionResult,
  isProcessing,
  copiedAscii,
  copiedPrompt,
  onCopyAscii,
  onCopyPrompt,
  onDownload,
  isAsciiFullscreen,
  setIsAsciiFullscreen,
}: AsciiDisplayProps) {
  return (
    <section className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col bg-[#111113] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#C4FF0E]">
          02 / GENERATED ASCII
        </span>

        {conversionResult && (
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-3 py-1 border border-white/10 bg-black text-[10px] font-bold uppercase text-slate-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5"
              title="Download Raw TXT"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download TXT</span>
            </button>
            <button
              onClick={onCopyAscii}
              className="px-3 py-1 bg-white text-black text-[10px] font-extrabold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              {copiedAscii ? <Check className="h-3.5 w-3.5 text-green-700" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedAscii ? "Copied!" : "Copy ASCII"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[320px] flex flex-col">
        {isProcessing ? (
          <div
            className="flex-1 flex flex-col min-h-0"
            role="status"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="flex flex-col items-center justify-center text-center py-4">
              <RefreshCw className="h-8 w-8 text-[#C4FF0E] animate-spin mb-2" />
              <p className="font-mono text-sm text-[#C4FF0E]">TRANSLATING INTERACTIVE UI LAYOUT...</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs font-mono">Gemini vision is tracing contours, alignment structures, widgets, text clusters, and inputs.</p>
            </div>

            <div className="bg-[#19191B] px-4 py-2 border-t border-x border-[#2D2D30] flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="bg-[#19191B] border border-[#2D2D30] p-6 flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className={`h-2.5 ${i % 3 === 0 ? "w-3/4" : "w-full"}`} />
              ))}
            </div>

            <div className="mt-6 border-t border-[#1E1E20] pt-6">
              <Skeleton className="h-3 w-40 mb-3" />
              <Skeleton className="h-12 w-full mb-4" />
              <div className="border border-white/5 bg-[#09090A] divide-y divide-white/5">
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
              </div>
              <div className="mt-6 bg-[#09090A] border border-white/10 p-4">
                <Skeleton className="h-3 w-48 mb-2" />
                <Skeleton className="h-2.5 w-full mb-1" />
                <Skeleton className="h-2.5 w-5/6" />
              </div>
            </div>
          </div>
        ) : conversionResult ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="bg-[#19191B] px-4 py-2 border-t border-x border-[#2D2D30] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>FORMAT: RAW ASCII TEXT</span>
              <span className="text-[#C4FF0E]">DETECTED SCREEN: {conversionResult.uiType}</span>
            </div>

            <div
              className={`bg-[#19191B] border border-[#2D2D30] p-6 font-mono text-[11px] leading-tight overflow-auto text-white/90 whitespace-pre ${
                isAsciiFullscreen ? "fixed inset-0 z-50 p-12 bg-black text-sm" : "relative"
              }`}
              id="ascii_output_box"
            >
              {conversionResult.asciiLayout}

              <button
                onClick={() => setIsAsciiFullscreen(!isAsciiFullscreen)}
                className="absolute bottom-3 right-3 p-1.5 bg-[#0F0F10] border border-[#2D2D30] text-slate-500 hover:text-white hover:border-slate-400"
                title={isAsciiFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
              >
                {isAsciiFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>

            <ComponentTable
              conversionResult={conversionResult}
              copiedPrompt={copiedPrompt}
              onCopyPrompt={onCopyPrompt}
            />
          </div>
        ) : (
          <div className="flex-1 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-[#131315]">
            <FileText className="h-12 w-12 text-slate-600 mb-4" />
            <p className="font-bold uppercase tracking-tight text-slate-400 mb-1">Output Console Idle</p>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-mono">
              Upload or sketch a custom UI mockup in the left pane, then click <strong className="text-white">"Generate ASCII"</strong> to receive an optimal layout structure.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

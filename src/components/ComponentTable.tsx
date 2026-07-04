import { Copy, Check } from "lucide-react";
import { ConversionResult } from "../types";

interface ComponentTableProps {
  conversionResult: ConversionResult;
  copiedPrompt: boolean;
  onCopyPrompt: () => void;
}

export default function ComponentTable({ conversionResult, copiedPrompt, onCopyPrompt }: ComponentTableProps) {
  return (
    <div className="mt-6 border-t border-[#1E1E20] pt-6">
      <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#C4FF0E] mb-3 font-mono">
        Parsed Components & Structure
      </h4>
      <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed bg-black/40 p-3 border border-white/5">
        <span className="text-white font-bold">Summary: </span>{conversionResult.layoutSummary}
      </p>

      <div className="border border-white/5 rounded-none overflow-hidden bg-[#09090A]">
        <table className="w-full text-left font-mono text-[10px] text-slate-300">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 uppercase text-slate-400">
              <th className="p-2">Component ID</th>
              <th className="p-2">Type</th>
              <th className="p-2">Label Context</th>
              <th className="p-2 text-right">Alignment</th>
            </tr>
          </thead>
          <tbody>
            {conversionResult.detectedComponents && conversionResult.detectedComponents.length > 0 ? (
              conversionResult.detectedComponents.map((component, idx) => (
                <tr key={component.id || idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-2 text-[#C4FF0E] font-bold font-mono">#{component.id}</td>
                  <td className="p-2 text-white font-mono">{component.type}</td>
                  <td className="p-2 text-slate-400 max-w-[120px] truncate">{component.label}</td>
                  <td className="p-2 text-right text-slate-400 font-mono">{component.alignment}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-600">No structured components detected. Try a different preset or upload.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-[#09090A] border border-white/10 p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase text-[#C4FF0E] tracking-widest font-mono">LLM-READY INSTRUCTION PROMPT</span>
          <button
            onClick={onCopyPrompt}
            className="p-1 px-3 bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
          >
            {copiedPrompt ? <Check className="h-3 w-3 text-[#C4FF0E]" /> : <Copy className="h-3 w-3" />}
            <span>{copiedPrompt ? "Copied!" : "Copy Full Prompt"}</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-500 font-mono leading-relaxed line-clamp-3 mb-1">
          {conversionResult.llmPromptReady}
        </p>
        <div className="text-[9px] text-[#C4FF0E]/70 font-mono italic">
          *Includes layout guidelines, ascii wireframe, components listing, and structural cues.
        </div>
      </div>
    </div>
  );
}

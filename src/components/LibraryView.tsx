import { ArrowRight, Sparkles } from "lucide-react";
import { PRESET_WIREFRAMES } from "../presets";

interface LibraryViewProps {
  onLoadPreset: (id: string) => void;
  onDirectConvert: (id: string) => void;
}

export default function LibraryView({ onLoadPreset, onDirectConvert }: LibraryViewProps) {
  return (
    <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-[#0E0E10] w-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-black uppercase mb-2 tracking-tight">Wireframe Preset Library</h2>
        <p className="text-xs text-slate-400 font-mono mb-8 max-w-xl">
          Select a pre-designed layout structure to immediately inspect how the system generates accurate and clean ASCII designs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRESET_WIREFRAMES.map((preset) => (
            <div
              key={preset.id}
              className="border border-[#1E1E20] bg-[#111113] p-6 flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C4FF0E] bg-slate-900 px-2 py-0.5 border border-[#1E1E20]">
                    {preset.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2 group-hover:text-[#C4FF0E] transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-mono mb-6">
                  {preset.description}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onLoadPreset(preset.id)}
                  className="px-4 py-2 bg-white text-black font-extrabold uppercase text-[10px] tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <span>Load Preset</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => onDirectConvert(preset.id)}
                  className="px-4 py-2 bg-[#C4FF0E] text-black font-extrabold uppercase text-[10px] tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <span>Direct Convert</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

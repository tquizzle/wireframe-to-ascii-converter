import { Settings } from "lucide-react";

type Style = "balanced" | "boxy" | "text-rich";

interface ConfigurationPanelProps {
  style: Style;
  setStyle: (s: Style) => void;
  includeAnnotations: boolean;
  setIncludeAnnotations: (v: boolean) => void;
}

export default function ConfigurationPanel({
  style,
  setStyle,
  includeAnnotations,
  setIncludeAnnotations,
}: ConfigurationPanelProps) {
  const styleButton = (key: Style, label: string) => (
    <button
      type="button"
      onClick={() => setStyle(key)}
      className={`py-1 text-[10px] font-bold uppercase rounded ${
        style === key ? "bg-[#C4FF0E] text-black" : "text-slate-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mb-6 bg-[#141416] border border-[#1E1E20] p-4">
      <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
        <Settings className="h-3 w-3 text-[#C4FF0E]" />
        <span>Conversion Controls</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 font-bold">ASCII Render Style</label>
          <div className="grid grid-cols-3 gap-1 border border-white/5 p-1 bg-black">
            {styleButton("balanced", "Classic")}
            {styleButton("boxy", "Boxy")}
            {styleButton("text-rich", "Text")}
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 font-bold">Metadata Elements</label>
          <button
            type="button"
            onClick={() => setIncludeAnnotations(!includeAnnotations)}
            className={`w-full py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center justify-between ${
              includeAnnotations
                ? "bg-slate-900 border-[#C4FF0E] text-[#C4FF0E]"
                : "bg-black border-white/10 text-slate-500 hover:text-white"
            }`}
          >
            <span>Analyze Components List</span>
            <span>{includeAnnotations ? "[ ENABLED ]" : "[ DISABLED ]"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

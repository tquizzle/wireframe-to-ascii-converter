import { HelpCircle } from "lucide-react";

type Tab = "editor" | "library" | "history";

interface SidebarProps {
  activeTab: Tab;
  onSelectEditor: () => void;
  onSelectPresetTab: () => void;
  onSelectHistoryTab: () => void;
  historyCount: number;
}

export default function Sidebar({
  activeTab,
  onSelectEditor,
  onSelectPresetTab,
  onSelectHistoryTab,
  historyCount,
}: SidebarProps) {
  const tabButtonClass = (isActive: boolean) =>
    `rotate-[-90deg] uppercase text-[11px] tracking-widest font-bold whitespace-nowrap transition-all duration-200 outline-none ${
      isActive
        ? "text-[#C4FF0E] font-extrabold opacity-100"
        : "text-slate-500 hover:text-white opacity-60"
    }`;

  return (
    <aside className="w-[80px] shrink-0 flex flex-col items-center py-6 bg-[#09090A] border-r-2 border-[#1E1E20] justify-between">
      <div className="flex flex-col items-center gap-12 w-full">
        <div
          className="w-11 h-11 bg-[#C4FF0E] flex items-center justify-center text-black font-black text-2xl tracking-tighter cursor-pointer"
          onClick={onSelectEditor}
        >
          W
        </div>

        <nav className="flex flex-col gap-14 mt-6">
          <button onClick={onSelectEditor} className={tabButtonClass(activeTab === "editor")}>
            Editor
          </button>
          <button onClick={onSelectPresetTab} className={tabButtonClass(activeTab === "library")}>
            Presets
          </button>
          <button onClick={onSelectHistoryTab} className={tabButtonClass(activeTab === "history")}>
            History ({historyCount})
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-5 items-center">
        <a
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            alert(
              "This application converts visual mockups & hand-drawn sketches into well-ordered ASCII diagrams. You can copy the generated ASCII structure or LLM prompt directly into any chatbot text editor to build fully functional code instantly."
            );
          }}
          className="text-slate-500 hover:text-white transition-colors"
          title="Help & Info"
        >
          <HelpCircle className="h-5 w-5" />
        </a>
        <div className="w-1.5 h-1.5 rounded-full bg-[#C4FF0E]"></div>
      </div>
    </aside>
  );
}

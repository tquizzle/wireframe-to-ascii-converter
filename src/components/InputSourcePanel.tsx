import React, { useState, useRef } from "react";
import { Upload, RefreshCw, Sparkles } from "lucide-react";
import ScribbleCanvas from "./ScribbleCanvas";
import ConfigurationPanel from "./ConfigurationPanel";
import { PRESET_WIREFRAMES } from "../presets";

type Style = "balanced" | "boxy" | "text-rich";
type InputMode = "upload" | "scribble";

interface InputSourcePanelProps {
  uploadedImage: string | null;
  selectedPresetId: string;
  isProcessing: boolean;
  errorMsg: string | null;
  style: Style;
  setStyle: (s: Style) => void;
  includeAnnotations: boolean;
  setIncludeAnnotations: (v: boolean) => void;
  onImageUploaded: (base64: string) => void;
  onError: (msg: string) => void;
  onConvert: () => void;
  onSelectPreset: (id: string) => void;
  onCanvasExport: (base64: string) => void;
}

export default function InputSourcePanel({
  uploadedImage,
  selectedPresetId,
  isProcessing,
  errorMsg,
  style,
  setStyle,
  includeAnnotations,
  setIncludeAnnotations,
  onImageUploaded,
  onError,
  onConvert,
  onSelectPreset,
  onCanvasExport,
}: InputSourcePanelProps) {
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file (PNG, JPG, SVG, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUploaded(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <section className="w-full lg:w-1/2 p-6 sm:p-10 border-r border-[#1E1E20] flex flex-col bg-[#0E0E10] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C4FF0E]">01 / INPUT SOURCE</span>
          {selectedPresetId && (
            <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 border border-blue-900 font-mono">
              Preset: {PRESET_WIREFRAMES.find(p => p.id === selectedPresetId)?.name}
            </span>
          )}
        </div>

        <div className="flex border border-white/10 p-0.5 bg-[#09090A]">
          <button
            onClick={() => setInputMode("upload")}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
              inputMode === "upload" ? "bg-white text-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputMode("scribble")}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
              inputMode === "scribble" ? "bg-white text-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Sketch Pad
          </button>
        </div>
      </div>

      <ConfigurationPanel
        style={style}
        setStyle={setStyle}
        includeAnnotations={includeAnnotations}
        setIncludeAnnotations={setIncludeAnnotations}
      />

      <div className="flex-1 flex flex-col min-h-[300px]">
        {inputMode === "upload" ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex-1 border-2 border-dashed rounded-none p-6 flex flex-col items-center justify-center relative transition-all ${
              dragActive
                ? "border-[#C4FF0E] bg-slate-900/40"
                : "border-white/10 bg-repeating-linear-gradient hover:border-white/20"
            }`}
            style={{
              background: "repeating-linear-gradient(45deg, #121214, #121214 10px, #161619 10px, #161619 20px)"
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {uploadedImage ? (
              <div className="w-full h-full flex flex-col justify-between items-center relative py-4">
                <div className="max-h-[250px] overflow-hidden border border-white/10 bg-black p-2 flex items-center justify-center">
                  <img
                    src={uploadedImage}
                    alt="Uploaded Wireframe Mockup"
                    className="max-h-[230px] object-contain max-w-full"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-1.5 border border-white/20 text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                  >
                    Replace Image
                  </button>
                  <button
                    onClick={onConvert}
                    disabled={isProcessing}
                    className="px-4 py-1.5 btn-accent text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                  >
                    {isProcessing ? (
                      <RefreshCw className="h-3 w-3 animate-spin text-black" />
                    ) : (
                      <Sparkles className="h-3 w-3 text-black" />
                    )}
                    <span>Re-Convert</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold uppercase tracking-tight text-white mb-1">Drag & Drop Wireframe Image</p>
                <p className="text-xs text-slate-500 mb-4">PNG, JPEG, GIF or SVG up to 10MB</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2 border border-white/20 text-[11px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                  >
                    Browse Files
                  </button>
                  <button
                    onClick={() => onSelectPreset("login")}
                    className="px-5 py-2 border border-[#C4FF0E]/30 text-[11px] font-bold uppercase tracking-wider text-[#C4FF0E] hover:bg-[#C4FF0E] hover:text-black transition-colors"
                  >
                    Load Preset
                  </button>
                </div>
              </div>
            )}

            <div className="absolute top-3 left-3 text-[9px] font-mono text-slate-600 tracking-widest uppercase">
              INPUT_PANEL // GRID
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-[350px]">
            <ScribbleCanvas onExport={onCanvasExport} isProcessing={isProcessing} />
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-[#1E1E20] pt-6">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 font-mono">
          Quick Templates:
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_WIREFRAMES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`text-left p-2.5 border transition-all text-xs flex flex-col justify-between ${
                selectedPresetId === preset.id
                  ? "border-[#C4FF0E] bg-slate-900"
                  : "border-white/5 bg-[#121214] hover:bg-slate-900 hover:border-white/15"
              }`}
            >
              <span className="font-extrabold uppercase text-[10px] text-white tracking-tight leading-tight block mb-1">
                {preset.name}
              </span>
              <span className="text-[9px] text-slate-500 font-mono truncate w-full">
                {preset.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono">
          <span className="font-bold">CONVERSION ERROR:</span> {errorMsg}
        </div>
      )}
    </section>
  );
}

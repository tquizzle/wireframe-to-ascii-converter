import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import InputSourcePanel from "./components/InputSourcePanel";
import AsciiDisplay from "./components/AsciiDisplay";
import LibraryView from "./components/LibraryView";
import HistoryView from "./components/HistoryView";
import Footer from "./components/Footer";
import { PRESET_WIREFRAMES, svgToPng } from "./presets";
import { ConversionResult, ConversionHistoryItem } from "./types";
import { copyToClipboard } from "./utils";
import { ErrorBoundary } from "./components/ErrorBoundary";

type Style = "balanced" | "boxy" | "text-rich";

export default function App() {
  // Navigation & view states
  const [activeTab, setActiveTab] = useState<"editor" | "library" | "history">("editor");

  // Wireframe source input states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  // Conversion config states
  const [style, setStyle] = useState<Style>("balanced");
  const [includeAnnotations, setIncludeAnnotations] = useState(true);

  // API loading & response states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  // Copy indicator states
  const [copiedAscii, setCopiedAscii] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // History state
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);

  // UI Modal / Fullscreen states
  const [isAsciiFullscreen, setIsAsciiFullscreen] = useState(false);
  const [stats, setStats] = useState({
    tokens: 0,
    timeMs: 0,
    componentsCount: 0
  });

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("wire2txt_history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load conversion history", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (item: ConversionHistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 20); // Keep last 20
      try {
        localStorage.setItem("wire2txt_history", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save history", e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your conversion history?")) {
      setHistory([]);
      localStorage.removeItem("wire2txt_history");
      if (activeTab === "history") {
        setActiveTab("editor");
      }
    }
  };

  // Core conversion flow — accepts an image so preset direct-convert can bypass state
  const runConversion = async (imageData: string) => {
    if (!imageData) {
      setErrorMsg("No image loaded. Upload, sketch, or select a preset first.");
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);
    const startedAt = performance.now();
    try {
      const response = await fetch("/api/convert-wireframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.details || data?.error || `Request failed (${response.status})`);
      }
      const result: ConversionResult = {
        asciiLayout: data.asciiLayout,
        uiType: data.uiType,
        layoutSummary: data.layoutSummary,
        detectedComponents: Array.isArray(data.detectedComponents) ? data.detectedComponents : [],
        llmPromptReady: data.llmPromptReady
      };
      setConversionResult(result);
      setStats({
        tokens: Math.ceil((result.llmPromptReady || "").length / 4),
        timeMs: Math.round(performance.now() - startedAt),
        componentsCount: result.detectedComponents.length
      });
      saveToHistory({
        id: `conv-${Date.now()}`,
        timestamp: new Date().toISOString(),
        uiType: result.uiType,
        imageBase64: imageData,
        layoutSummary: result.layoutSummary,
        asciiLayout: result.asciiLayout,
        detectedComponents: result.detectedComponents,
        llmPromptReady: result.llmPromptReady,
        style
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Conversion failed";
      setErrorMsg(message);
      setConversionResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = () => {
    if (uploadedImage) {
      runConversion(uploadedImage);
    } else {
      setErrorMsg("No image loaded. Upload, sketch, or select a preset first.");
    }
  };

  // Load a preset into the editor input (SVG -> PNG base64)
  const handleSelectPreset = async (id: string) => {
    const preset = PRESET_WIREFRAMES.find((p) => p.id === id);
    if (!preset) return;
    try {
      const png = await svgToPng(preset.svg);
      setUploadedImage(png);
      setSelectedPresetId(id);
      setErrorMsg(null);
      setConversionResult(null);
      if (activeTab !== "editor") {
        setActiveTab("editor");
      }
    } catch (e) {
      console.error("Failed to load preset", e);
      setErrorMsg("Failed to render the selected preset. Try another.");
    }
  };

  // Library "Direct Convert" — render preset and convert immediately
  const handleDirectConvert = async (id: string) => {
    const preset = PRESET_WIREFRAMES.find((p) => p.id === id);
    if (!preset) return;
    try {
      const png = await svgToPng(preset.svg);
      setUploadedImage(png);
      setSelectedPresetId(id);
      setActiveTab("editor");
      await runConversion(png);
    } catch (e) {
      console.error("Direct convert failed", e);
      setErrorMsg("Failed to render preset for conversion.");
    }
  };

  // Restore a history entry into the editor
  const handleLoadHistoryItem = (item: ConversionHistoryItem) => {
    setUploadedImage(item.imageBase64);
    setSelectedPresetId("");
    setConversionResult({
      asciiLayout: item.asciiLayout,
      uiType: item.uiType,
      layoutSummary: item.layoutSummary,
      detectedComponents: item.detectedComponents,
      llmPromptReady: item.llmPromptReady
    });
    setStats({
      tokens: Math.ceil((item.llmPromptReady || "").length / 4),
      timeMs: 0,
      componentsCount: item.detectedComponents.length
    });
    setActiveTab("editor");
  };

  const handleCopyAscii = async () => {
    if (!conversionResult?.asciiLayout) return;
    try {
      await copyToClipboard(conversionResult.asciiLayout);
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 2000);
    } catch (e) {
      console.error("Copy ASCII failed", e);
    }
  };

  const handleCopyPrompt = async () => {
    if (!conversionResult?.llmPromptReady) return;
    try {
      await copyToClipboard(conversionResult.llmPromptReady);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (e) {
      console.error("Copy prompt failed", e);
    }
  };

  const handleDownload = () => {
    if (!conversionResult?.asciiLayout) return;
    const blob = new Blob([conversionResult.asciiLayout], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wire2txt_${conversionResult.uiType || "ascii"}.txt`.replace(/\s+/g, "_").toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImageUploaded = (base64: string) => {
    setUploadedImage(base64);
    setSelectedPresetId("");
    setErrorMsg(null);
  };

  return (
    <div className="flex h-screen bg-[#0B0B0C] text-white overflow-hidden font-sans">
      <Sidebar
        activeTab={activeTab}
        onSelectEditor={() => setActiveTab("editor")}
        onSelectPresetTab={() => setActiveTab("library")}
        onSelectHistoryTab={() => setActiveTab("history")}
        historyCount={history.length}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          hasImage={!!uploadedImage}
          isProcessing={isProcessing}
          activeTab={activeTab}
          onConvert={handleConvert}
          onGoToWorkspace={() => setActiveTab("editor")}
        />
        <main className="flex-1 flex min-h-0 overflow-hidden">
          <ErrorBoundary>
          {activeTab === "editor" && (
            <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
              <InputSourcePanel
                uploadedImage={uploadedImage}
                selectedPresetId={selectedPresetId}
                isProcessing={isProcessing}
                errorMsg={errorMsg}
                style={style}
                setStyle={setStyle}
                includeAnnotations={includeAnnotations}
                setIncludeAnnotations={setIncludeAnnotations}
                onImageUploaded={handleImageUploaded}
                onError={setErrorMsg}
                onConvert={handleConvert}
                onSelectPreset={handleSelectPreset}
                onCanvasExport={handleImageUploaded}
              />
              <AsciiDisplay
                conversionResult={conversionResult}
                isProcessing={isProcessing}
                copiedAscii={copiedAscii}
                copiedPrompt={copiedPrompt}
                onCopyAscii={handleCopyAscii}
                onCopyPrompt={handleCopyPrompt}
                onDownload={handleDownload}
                isAsciiFullscreen={isAsciiFullscreen}
                setIsAsciiFullscreen={setIsAsciiFullscreen}
              />
            </div>
          )}
          {activeTab === "library" && (
            <LibraryView
              onLoadPreset={handleSelectPreset}
              onDirectConvert={handleDirectConvert}
            />
          )}
          {activeTab === "history" && (
            <HistoryView
              history={history}
              onClearHistory={clearHistory}
              onLoadItem={handleLoadHistoryItem}
              onGoToEditor={() => setActiveTab("editor")}
            />
          )}
          </ErrorBoundary>
        </main>
        <Footer hasResult={!!conversionResult} stats={stats} />
      </div>
    </div>
  );
}

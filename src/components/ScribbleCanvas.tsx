import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, RotateCcw, Sparkles } from "lucide-react";

interface ScribbleCanvasProps {
  onExport: (base64Png: string) => void;
  isProcessing: boolean;
}

export default function ScribbleCanvas({ onExport, isProcessing }: ScribbleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const [lineWidth, setLineWidth] = useState(4);
  const [canvasHasDrawing, setCanvasHasDrawing] = useState(false);

  // Initialize canvas size and default styles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      // Get container dimensions
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 600;
      const height = rect?.height || 400;

      // Create a temporary offscreen canvas to save existing drawing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      // Set resolution based on backing store size
      canvas.width = width;
      canvas.height = height;

      // Fill with solid white background
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        // Restore saved drawing if there was one
        ctx.drawImage(tempCanvas, 0, 0, width, height);
        
        // Reapply default drawing configurations
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Set context parameters based on selected tool and width
  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    
    if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff";
    } else {
      ctx.strokeStyle = "#1e293b"; // Charcoal/Slate-800 for high-contrast wireframe
    }
    return ctx;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = getContext();
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setCanvasHasDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getEventCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setCanvasHasDrawing(false);
  };

  const handleConvert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas content to PNG base64 data URL
    const pngDataUrl = canvas.toDataURL("image/png");
    onExport(pngDataUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden" id="scribble_pad_root">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            id="tool_pencil"
            onClick={() => setTool("pencil")}
            className={`p-2 rounded-lg flex items-center space-x-1.5 transition-all text-xs font-medium ${
              tool === "pencil"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Pencil Tool"
          >
            <Paintbrush className="h-4 w-4" />
            <span className="hidden sm:inline">Sketch</span>
          </button>
          
          <button
            type="button"
            id="tool_eraser"
            onClick={() => setTool("eraser")}
            className={`p-2 rounded-lg flex items-center space-x-1.5 transition-all text-xs font-medium ${
              tool === "eraser"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Eraser Tool"
          >
            <Eraser className="h-4 w-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>
        </div>

        {/* Thickness settings */}
        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span>Size:</span>
            <input
              type="range"
              id="pencil_thickness_slider"
              min="2"
              max="12"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
            <span className="font-mono w-4 text-right">{lineWidth}px</span>
          </div>

          <button
            type="button"
            id="btn_clear_canvas"
            onClick={handleClear}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all flex items-center space-x-1"
            title="Clear canvas"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div ref={containerRef} className="flex-1 w-full bg-white relative min-h-[250px] sm:min-h-[320px]">
        {!canvasHasDrawing && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <p className="font-display font-medium text-sm text-slate-500 mb-1">Interactive Wireframe Scribble Pad</p>
            <p className="text-xs max-w-xs leading-relaxed text-slate-400">
              Draw blocks, buttons <span className="font-mono">[ Button ]</span>, inputs, headings, or lines here.
            </p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair"
        />
      </div>

      {/* Footer trigger */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          id="btn_convert_canvas"
          onClick={handleConvert}
          disabled={isProcessing || !canvasHasDrawing}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all ${
            isProcessing || !canvasHasDrawing
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer shadow-blue-100 active:scale-[0.98]"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Convert Sketch to ASCII</span>
        </button>
      </div>
    </div>
  );
}

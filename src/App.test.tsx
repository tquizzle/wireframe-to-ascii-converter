import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "./App";
import { ConversionHistoryItem } from "./types";

vi.mock("./presets", () => ({
  PRESET_WIREFRAMES: [
    { id: "login", name: "Clean Login Card", description: "A login form.", category: "Forms", svg: "<svg/>" },
    { id: "dashboard", name: "Admin Dashboard", description: "A dashboard.", category: "Dashboards", svg: "<svg/>" }
  ],
  svgToPng: vi.fn().mockResolvedValue("data:image/png;base64,ZmFrZQ==")
}));

const mockConversionPayload = {
  asciiLayout: "+----------+\n| Login    |\n+----------+",
  uiType: "Login Form",
  layoutSummary: "A login form with email and password fields.",
  detectedComponents: [
    { id: "c1", type: "button", label: "Sign In", alignment: "center" }
  ],
  llmPromptReady: "Create a login form with email and password fields."
};

const historyItem: ConversionHistoryItem = {
  id: "conv-1700000000000",
  timestamp: "2026-07-02T10:00:00.000Z",
  uiType: "Login Form",
  imageBase64: "data:image/png;base64,c2FtcGxl",
  layoutSummary: "A previously converted login form.",
  asciiLayout: "+------+\n| Prev |\n+------+",
  detectedComponents: [{ id: "h1", type: "input", label: "Email", alignment: "left" }],
  llmPromptReady: "Recreate the prior login form.",
  style: "balanced"
};

const localStorageStore = new Map<string, string>();

function installLocalStorageShim() {
  const shim = {
    getItem: (k: string) => localStorageStore.get(k) ?? null,
    setItem: (k: string, v: string) => { localStorageStore.set(k, String(v)); },
    removeItem: (k: string) => { localStorageStore.delete(k); },
    clear: () => { localStorageStore.clear(); },
    key: (i: number) => Array.from(localStorageStore.keys())[i] ?? null,
    get length() { return localStorageStore.size; }
  };
  Object.defineProperty(window, "localStorage", { value: shim, configurable: true, writable: true });
}

describe("App", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let clipboardWrite: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageStore.clear();
    installLocalStorageShim();

    mockFetch = vi.fn();
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockConversionPayload
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    clipboardWrite = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: clipboardWrite },
      configurable: true
    });

    Object.defineProperty(URL, "createObjectURL", {
      value: vi.fn(() => "blob:fake-url"),
      configurable: true
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: vi.fn(),
      configurable: true
    });
  });

  test("renders the app shell on the editor tab by default", () => {
    render(<App />);
    expect(screen.getByText("W")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /WIRE2TXT/i })).toBeInTheDocument();
    expect(screen.getByText(/01 \/ INPUT SOURCE/i)).toBeInTheDocument();
    expect(screen.getByText(/02 \/ GENERATED ASCII/i)).toBeInTheDocument();
  });

  test("renders the idle output console before any conversion", () => {
    render(<App />);
    expect(screen.getByText(/Output Console Idle/i)).toBeInTheDocument();
  });

  test("switches to the Presets tab when the Presets nav button is clicked", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /presets/i }));
    expect(screen.getByText(/Wireframe Preset Library/i)).toBeInTheDocument();
    expect(screen.getByText("Clean Login Card")).toBeInTheDocument();
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  test("switches to the History tab and shows the empty state", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /history/i }));
    expect(screen.getByText(/Conversion History/i)).toBeInTheDocument();
    expect(screen.getByText(/No past conversions found/i)).toBeInTheDocument();
  });

  test("history count badge reflects localStorage entries on mount", () => {
    localStorage.setItem("wire2txt_history", JSON.stringify([historyItem]));
    render(<App />);
    expect(screen.getByRole("button", { name: /history \(1\)/i })).toBeInTheDocument();
  });

  test("loading a preset sets the uploaded image and reveals the Generate button", async () => {
    render(<App />);
    expect(screen.queryByRole("button", { name: /generate ascii/i })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /^load preset$/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /generate ascii/i })).toBeInTheDocument();
    });
    expect(screen.getByAltText(/Uploaded Wireframe Mockup/i)).toBeInTheDocument();
  });

  test("clicking Generate ASCII calls the convert API and displays the result with footer stats", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /^load preset$/i }));

    const generateButton = await screen.findByRole("button", { name: /generate ascii/i });
    await userEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/DETECTED SCREEN: Login Form/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Approx Tokens:/i)).toBeInTheDocument();
    expect(screen.getByText(/Detected Items:/i)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/convert-wireframe",
      expect.objectContaining({ method: "POST" })
    );
  });

  test("a failed convert surfaces the error message in the input panel", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "server_error", details: "Gemini service is down" })
    });

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /^load preset$/i }));
    const generateButton = await screen.findByRole("button", { name: /generate ascii/i });
    await userEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/Gemini service is down/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Output Console Idle/i)).toBeInTheDocument();
  });

  test("a successful convert persists a history entry to localStorage", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /^load preset$/i }));
    const generateButton = await screen.findByRole("button", { name: /generate ascii/i });
    await userEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/DETECTED SCREEN: Login Form/i)).toBeInTheDocument();
    });

    const stored = JSON.parse(localStorage.getItem("wire2txt_history") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].uiType).toBe("Login Form");
  });

  test("Copy ASCII writes to the clipboard and toggles the Copied indicator", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /^load preset$/i }));
    const generateButton = await screen.findByRole("button", { name: /generate ascii/i });
    await userEvent.click(generateButton);

    const copyButton = await screen.findByRole("button", { name: /copy ascii/i });
    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(clipboardWrite).toHaveBeenCalledWith(mockConversionPayload.asciiLayout);
    });
    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  test("clearing history empties localStorage and resets the count", async () => {
    localStorage.setItem("wire2txt_history", JSON.stringify([historyItem]));
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: /history/i }));
    await userEvent.click(screen.getByRole("button", { name: /clear all history/i }));

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("wire2txt_history")).toBeNull();
    expect(screen.getByRole("button", { name: /history \(0\)/i })).toBeInTheDocument();
    confirmSpy.mockRestore();
  });

  test("loading a history item restores the result and switches to the editor", async () => {
    localStorage.setItem("wire2txt_history", JSON.stringify([historyItem]));
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /history/i }));
    await userEvent.click(screen.getByRole("button", { name: /load workspace/i }));

    await waitFor(() => {
      expect(screen.getByText(/01 \/ INPUT SOURCE/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/DETECTED SCREEN: Login Form/i)).toBeInTheDocument();
  });

  test("does not call the convert API when no image is loaded", () => {
    render(<App />);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /generate ascii/i })).not.toBeInTheDocument();
  });
});

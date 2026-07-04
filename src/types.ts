export interface DetectedComponent {
  id: string;
  type: string;
  label: string;
  alignment: string;
}

export interface ConversionResult {
  asciiLayout: string;
  uiType: string;
  layoutSummary: string;
  detectedComponents: DetectedComponent[];
  llmPromptReady: string;
}

export interface ConversionHistoryItem {
  id: string;
  timestamp: string;
  uiType: string;
  imageBase64: string | null;
  layoutSummary: string;
  asciiLayout: string;
  detectedComponents: DetectedComponent[];
  llmPromptReady: string;
  style: string;
}

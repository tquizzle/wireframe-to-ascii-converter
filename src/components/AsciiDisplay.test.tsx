import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AsciiDisplay from './AsciiDisplay';
import { vi } from 'vitest';

describe('AsciiDisplay', () => {
  const mockProps = {
    conversionResult: null,
    isProcessing: false,
    copiedAscii: false,
    copiedPrompt: false,
    onCopyAscii: vi.fn(),
    onCopyPrompt: vi.fn(),
    onDownload: vi.fn(),
    isAsciiFullscreen: false,
    setIsAsciiFullscreen: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders idle state when no conversion result', () => {
    render(<AsciiDisplay {...mockProps} />);
    expect(screen.getByText(/Output Console Idle/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload or sketch a custom UI mockup/i)).toBeInTheDocument();
  });

  test('shows processing state when isProcessing is true', () => {
    render(<AsciiDisplay
      {...mockProps}
      isProcessing={true}
    />);
    expect(screen.getByText(/TRANSLATING INTERACTIVE UI LAYOUT.../i)).toBeInTheDocument();
  });

  test('shows ascii output when conversionResult is provided', () => {
    const mockResult = {
      asciiLayout: 'TEST ASCII ART',
      uiType: 'Mobile',
      layoutSummary: 'Test layout summary',
      llmPromptReady: 'Test prompt',
      detectedComponents: []
    };

    render(<AsciiDisplay
      {...mockProps}
      conversionResult={mockResult}
    />);

    expect(screen.getByText(/FORMAT: RAW ASCII TEXT/i)).toBeInTheDocument();
    expect(screen.getByText(/DETECTED SCREEN: Mobile/i)).toBeInTheDocument();
    expect(screen.getByText(/TEST ASCII ART/)).toBeInTheDocument();
  });

  test('shows download button when conversionResult exists', () => {
    const mockResult = {
      asciiLayout: 'TEST',
      uiType: 'Web',
      layoutSummary: 'Test',
      llmPromptReady: 'Test',
      detectedComponents: []
    };

    render(<AsciiDisplay
      {...mockProps}
      conversionResult={mockResult}
    />);

    expect(screen.getByRole('button', { name: /Download TXT/i })).toBeInTheDocument();
  });

  test('shows copy ascii button when conversionResult exists', () => {
    const mockResult = {
      asciiLayout: 'TEST',
      uiType: 'Web',
      layoutSummary: 'Test',
      llmPromptReady: 'Test',
      detectedComponents: []
    };

    render(<AsciiDisplay
      {...mockProps}
      conversionResult={mockResult}
    />);

    expect(screen.getByRole('button', { name: /Copy ASCII/i })).toBeInTheDocument();
  });

  test('calls onCopyAscii when copy ascii button clicked', async () => {
    const mockResult = {
      asciiLayout: 'TEST',
      uiType: 'Web',
      layoutSummary: 'Test',
      llmPromptReady: 'Test',
      detectedComponents: []
    };

    render(<AsciiDisplay
      {...mockProps}
      conversionResult={mockResult}
    />);

    await userEvent.click(screen.getByRole('button', { name: /Copy ASCII/i }));
    expect(mockProps.onCopyAscii).toHaveBeenCalled();
  });

  test('shows copied state when copiedAscii is true', () => {
    const mockResult = {
      asciiLayout: 'TEST',
      uiType: 'Web',
      layoutSummary: 'Test',
      llmPromptReady: 'Test',
      detectedComponents: []
    };

    render(<AsciiDisplay
      {...mockProps}
      conversionResult={mockResult}
      copiedAscii={true}
    />);

    expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
  });

  test('toggles fullscreen when fullscreen button clicked', async () => {
    const mockResult = {
      asciiLayout: 'TEST',
      uiType: 'Web',
      layoutSummary: 'Test',
      llmPromptReady: 'Test',
      detectedComponents: []
    };

    render(<AsciiDisplay
      {...mockProps}
      conversionResult={mockResult}
    />);

    await userEvent.click(screen.getByRole('button', { name: /Fullscreen View/i }));
    expect(mockProps.setIsAsciiFullscreen).toHaveBeenCalledWith(true);
  });

  test('shows component table when conversionResult exists', () => {
    const mockResult = {
      asciiLayout: 'TEST',
      uiType: 'Web',
      layoutSummary: 'Test',
      llmPromptReady: 'Test',
      detectedComponents: [{ id: '1', type: 'button', label: 'Submit', alignment: 'center' }]
    };

    render(<AsciiDisplay
      {...mockProps}
      conversionResult={mockResult}
    />);

    expect(screen.getByText(/Parsed Components & Structure/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test('marks the processing container with aria-busy and aria-live', () => {
    render(<AsciiDisplay {...mockProps} isProcessing={true} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  test('renders multiple skeleton placeholders while processing', () => {
    const { container } = render(<AsciiDisplay {...mockProps} isProcessing={true} />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(5);
  });
});
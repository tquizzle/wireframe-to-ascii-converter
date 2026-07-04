import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryView from './HistoryView';
import { vi } from 'vitest';

describe('HistoryView', () => {
  const mockHistory = [
    {
      id: '1',
      imageBase64: 'data:image/png;base64,test1',
      uiType: 'Mobile',
      style: 'balanced',
      layoutSummary: 'Login form with email and password fields',
      asciiLayout: '+----+',
      llmPromptReady: 'login prompt',
      timestamp: '2026-07-03 10:30:00',
      detectedComponents: [{ id: '1', type: 'input', label: 'Email', alignment: 'left' }]
    },
    {
      id: '2',
      imageBase64: null,
      uiType: 'Web',
      style: 'boxy',
      layoutSummary: 'Dashboard with charts and sidebar',
      asciiLayout: '+---+',
      llmPromptReady: 'dashboard prompt',
      timestamp: '2026-07-03 09:15:00',
      detectedComponents: []
    }
  ];

  const mockProps = {
    history: mockHistory,
    onClearHistory: vi.fn(),
    onLoadItem: vi.fn(),
    onGoToEditor: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders history title', () => {
    render(<HistoryView {...mockProps} />);
    expect(screen.getByText(/Conversion History/i)).toBeInTheDocument();
  });

  test('renders history description', () => {
    render(<HistoryView {...mockProps} />);
    expect(screen.getByText(/Access and reuse previously converted UI designs/i)).toBeInTheDocument();
  });

  test('shows empty state when history is empty', () => {
    render(<HistoryView
      {...mockProps}
      history={[]}
    />);
    expect(screen.getByText(/No past conversions found/i)).toBeInTheDocument();
    expect(screen.getByText(/Start by uploading or sketching inside the editor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to Editor/i })).toBeInTheDocument();
  });

  test('renders history items when history exists', () => {
    render(<HistoryView {...mockProps} />);
    expect(screen.getAllByText(/Login form with email and password fields/i)).toHaveLength(1);
    expect(screen.getAllByText(/Dashboard with charts and sidebar/i)).toHaveLength(1);
  });

  test('displays history item image when present', () => {
    render(<HistoryView {...mockProps} />);
    const imgElement = screen.getByRole('img', { name: /thumbnail/i });
    expect(imgElement).toHaveAttribute('src', 'data:image/png;base64,test1');
  });

  test('does not display image when imageBase64 is null', () => {
    render(<HistoryView {...mockProps} />);
    // The second item has null imageBase64, so we check that there's only one image
    const imgElements = screen.getAllByRole('img', { name: /thumbnail/i });
    expect(imgElements).toHaveLength(1); // Only first item has image
  });

  test('displays ui type and style for each history item', () => {
    render(<HistoryView {...mockProps} />);
    expect(screen.getByText(/Mobile/i)).toBeInTheDocument();
    expect(screen.getByText(/Style: balanced/i)).toBeInTheDocument();
    expect(screen.getByText(/Web/i)).toBeInTheDocument();
    expect(screen.getByText(/Style: boxy/i)).toBeInTheDocument();
  });

  test('displays timestamp and component count', () => {
    render(<HistoryView {...mockProps} />);
    expect(screen.getByText(/Converted at 2026-07-03 10:30:00 \/\/ 1 components detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Converted at 2026-07-03 09:15:00 \/\/ 0 components detected/i)).toBeInTheDocument();
  });

  test('shows load workspace button for each history item', () => {
    render(<HistoryView {...mockProps} />);
    const loadButtons = screen.getAllByRole('button', { name: /Load Workspace/i });
    expect(loadButtons).toHaveLength(2);
  });

  test('calls onLoadItem when load workspace button clicked', async () => {
    render(<HistoryView {...mockProps} />);
    const loadButtons = screen.getAllByRole('button', { name: /Load Workspace/i });
    await userEvent.click(loadButtons[0]);
    expect(mockProps.onLoadItem).toHaveBeenCalledWith(mockHistory[0]);
  });

  test('shows clear history button when history exists', () => {
    render(<HistoryView {...mockProps} />);
    expect(screen.getByRole('button', { name: /Clear All History/i })).toBeInTheDocument();
  });

  test('hides clear history button when history is empty', () => {
    render(<HistoryView
      {...mockProps}
      history={[]}
    />);
    expect(screen.queryByTitle(/Clear All History/i)).not.toBeInTheDocument();
  });

  test('calls onClearHistory when clear history button clicked', async () => {
    render(<HistoryView {...mockProps} />);
    const clearButton = screen.getByRole('button', { name: /Clear All History/i });
    await userEvent.click(clearButton);
    expect(mockProps.onClearHistory).toHaveBeenCalled();
  });

  test('calls onGoToEditor when go to editor button clicked', async () => {
    render(<HistoryView
      {...mockProps}
      history={[]}
    />);
    const editorButton = screen.getByRole('button', { name: /Go to Editor/i });
    await userEvent.click(editorButton);
    expect(mockProps.onGoToEditor).toHaveBeenCalled();
  });
});
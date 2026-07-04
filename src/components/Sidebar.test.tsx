import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  const mockProps = {
    activeTab: 'editor' as const,
    onSelectEditor: vi.fn(),
    onSelectPresetTab: vi.fn(),
    onSelectHistoryTab: vi.fn(),
    historyCount: 5
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without errors', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByText('W')).toBeInTheDocument();
  });

  test('renders the W logo brand mark', () => {
    render(<Sidebar {...mockProps} />);
    const logo = screen.getByText('W');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('bg-[#C4FF0E]');
  });

  test('renders all three navigation buttons', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByRole('button', { name: /editor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /presets/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
  });

  test('displays the history count in the History button', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByRole('button', { name: /history \(5\)/i })).toBeInTheDocument();
  });

  test('displays zero history count correctly', () => {
    render(<Sidebar {...mockProps} historyCount={0} />);
    expect(screen.getByRole('button', { name: /history \(0\)/i })).toBeInTheDocument();
  });

  test('calls onSelectEditor when the W logo is clicked', async () => {
    render(<Sidebar {...mockProps} />);
    await userEvent.click(screen.getByText('W'));
    expect(mockProps.onSelectEditor).toHaveBeenCalledTimes(1);
  });

  test('calls onSelectEditor when the Editor button is clicked', async () => {
    render(<Sidebar {...mockProps} />);
    await userEvent.click(screen.getByRole('button', { name: /^editor$/i }));
    expect(mockProps.onSelectEditor).toHaveBeenCalledTimes(1);
  });

  test('calls onSelectPresetTab when the Presets button is clicked', async () => {
    render(<Sidebar {...mockProps} />);
    await userEvent.click(screen.getByRole('button', { name: /presets/i }));
    expect(mockProps.onSelectPresetTab).toHaveBeenCalledTimes(1);
  });

  test('calls onSelectHistoryTab when the History button is clicked', async () => {
    render(<Sidebar {...mockProps} />);
    await userEvent.click(screen.getByRole('button', { name: /history/i }));
    expect(mockProps.onSelectHistoryTab).toHaveBeenCalledTimes(1);
  });

  test('applies active styling to Editor button when activeTab is editor', () => {
    render(<Sidebar {...mockProps} activeTab="editor" />);
    const editorButton = screen.getByRole('button', { name: /^editor$/i });
    expect(editorButton).toHaveClass('text-[#C4FF0E]');
    expect(editorButton).toHaveClass('font-extrabold');
  });

  test('applies active styling to Presets button when activeTab is library', () => {
    render(<Sidebar {...mockProps} activeTab="library" />);
    const presetsButton = screen.getByRole('button', { name: /presets/i });
    expect(presetsButton).toHaveClass('text-[#C4FF0E]');
    expect(presetsButton).toHaveClass('font-extrabold');
  });

  test('applies active styling to History button when activeTab is history', () => {
    render(<Sidebar {...mockProps} activeTab="history" />);
    const historyButton = screen.getByRole('button', { name: /history/i });
    expect(historyButton).toHaveClass('text-[#C4FF0E]');
    expect(historyButton).toHaveClass('font-extrabold');
  });

  test('applies inactive styling to non-active buttons', () => {
    render(<Sidebar {...mockProps} activeTab="editor" />);
    const presetsButton = screen.getByRole('button', { name: /presets/i });
    expect(presetsButton).toHaveClass('text-slate-500');
    expect(presetsButton).toHaveClass('opacity-60');
  });

  test('renders the help link with a descriptive title', () => {
    render(<Sidebar {...mockProps} />);
    const helpLink = screen.getByRole('link');
    expect(helpLink).toHaveAttribute('title', 'Help & Info');
  });

  test('triggers an alert with help info when the help link is clicked', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Sidebar {...mockProps} />);
    await userEvent.click(screen.getByRole('link'));
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('converts visual mockups'));
    alertSpy.mockRestore();
  });
});

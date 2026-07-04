import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScribbleCanvas from './ScribbleCanvas';
import { vi } from 'vitest';

describe('ScribbleCanvas', () => {
  const mockProps = {
    onExport: vi.fn(),
    isProcessing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without throwing', () => {
    expect(() => {
      render(<ScribbleCanvas {...mockProps} />);
    }).not.toThrow();
  });

  test('renders title text', () => {
    render(<ScribbleCanvas {...mockProps} />);
    // The title is in an absolutely positioned div at the top
    const titleElement = screen.getByText(/Interactive Wireframe Scribble Pad/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders pencil and eraser tools', () => {
    render(<ScribbleCanvas {...mockProps} />);
    expect(screen.getByTitle(/Pencil Tool/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Eraser Tool/i)).toBeInTheDocument();
  });

  test('renders size label', () => {
    render(<ScribbleCanvas {...mockProps} />);
    // The size label is a span, not a label element
    expect(screen.getByText(/Size:/i)).toBeInTheDocument();
  });

  test('renders thickness slider value', () => {
    render(<ScribbleCanvas {...mockProps} />);
    // The value and "px" are in separate spans
    const valueSpan = screen.getByText(/4/i, { selector: 'span.font-mono.w-4.text-right' });
    const unitSpan = screen.getByText(/px/i, { selector: 'span.font-mono.w-4.text-right' });
    expect(valueSpan).toBeInTheDocument();
    expect(unitSpan).toBeInTheDocument();
  });

  test('renders reset button', () => {
    render(<ScribbleCanvas {...mockProps} />);
    expect(screen.getByTitle(/Clear canvas/i)).toBeInTheDocument();
  });

  test('renders convert button', () => {
    render(<ScribbleCanvas {...mockProps} />);
    // The convert button has text inside a span, use getByText
    expect(screen.getByText(/Convert Sketch to ASCII/i)).toBeInTheDocument();
  });

  test('shows pencil tool as active by default', () => {
    render(<ScribbleCanvas {...mockProps} />);
    const pencilButton = screen.getByTitle(/Pencil Tool/i);
    // Check if it has the active styling (bg-slate-900 text-white)
    expect(pencilButton).toHaveClass('bg-slate-900');
    expect(pencilButton).toHaveClass('text-white');
  });

  test('can switch to eraser tool', async () => {
    render(<ScribbleCanvas {...mockProps} />);
    const eraserButton = screen.getByTitle(/Eraser Tool/i);
    await userEvent.click(eraserButton);
    expect(eraserButton).toHaveClass('bg-slate-900');
    expect(eraserButton).toHaveClass('text-white');
  });

  test('reset button has correct tooltip', () => {
    render(<ScribbleCanvas {...mockProps} />);
    const resetButton = screen.getByTitle(/Clear canvas/i);
    expect(resetButton).toHaveAttribute('title', 'Clear canvas');
  });
});
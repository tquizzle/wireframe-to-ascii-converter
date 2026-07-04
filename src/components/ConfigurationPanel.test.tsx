import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigurationPanel from './ConfigurationPanel';
import { vi } from 'vitest';

describe('ConfigurationPanel', () => {
  let includeAnnotations = false;
  let mockProps = {
    style: 'balanced' as const,
    setStyle: vi.fn(),
    includeAnnotations: false,
    setIncludeAnnotations: (v: boolean) => {
      includeAnnotations = v;
    }
  };

  beforeEach(() => {
    includeAnnotations = false;
    mockProps = {
      style: 'balanced' as const,
      setStyle: vi.fn(),
      includeAnnotations: false,
      setIncludeAnnotations: (v: boolean) => {
        includeAnnotations = v;
      }
    };
    vi.clearAllMocks();
  });

  test('renders without errors', () => {
    render(<ConfigurationPanel {...mockProps} />);
    expect(screen.getByText('Conversion Controls')).toBeInTheDocument();
  });

  test('renders ASCII render style section', () => {
    render(<ConfigurationPanel {...mockProps} />);

    expect(screen.getByText('ASCII Render Style')).toBeInTheDocument();
    expect(screen.getByText('Classic')).toBeInTheDocument();
    expect(screen.getByText('Boxy')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  test('renders metadata elements section', () => {
    render(<ConfigurationPanel {...mockProps} />);

    expect(screen.getByText('Metadata Elements')).toBeInTheDocument();
    expect(screen.getByText('Analyze Components List')).toBeInTheDocument();
    expect(screen.getByText('[ DISABLED ]')).toBeInTheDocument();
  });

  test('highlights selected style button', () => {
    render(<ConfigurationPanel {...mockProps} />);

    // Initially, 'balanced' (Classic) should be selected
    const classicButton = screen.getByRole('button', { name: /classic/i });
    expect(classicButton).toHaveClass('bg-[#C4FF0E]');
    expect(classicButton).toHaveClass('text-black');

    // Boxy and Text buttons should not be selected
    const boxyButton = screen.getByRole('button', { name: /boxy/i });
    expect(boxyButton).not.toHaveClass('bg-[#C4FF0E]');

    const textButton = screen.getByRole('button', { name: /text/i });
    expect(textButton).not.toHaveClass('bg-[#C4FF0E]');
  });

  test('changes style when style button is clicked', async () => {
    render(<ConfigurationPanel {...mockProps} />);

    // Click the Boxy button
    const boxyButton = screen.getByRole('button', { name: /boxy/i });
    await userEvent.click(boxyButton);

    expect(mockProps.setStyle).toHaveBeenCalledWith('boxy');

    // Click the Text button
    const textButton = screen.getByRole('button', { name: /text/i });
    await userEvent.click(textButton);

    expect(mockProps.setStyle).toHaveBeenCalledWith('text-rich');
  });

  test('toggles includeAnnotations when button is clicked', async () => {
    // Reset for this test
    includeAnnotations = false;
    mockProps.includeAnnotations = false;

    const { rerender } = render(<ConfigurationPanel {...mockProps} />);

    // Get the toggle button
    let toggleButton = screen.getByRole('button', { name: /analyze components list/i });

    // Initially should show "Analyze Components List[ DISABLED ]"
    expect(toggleButton).toHaveTextContent('Analyze Components List[ DISABLED ]');

    // Click the toggle button
    await userEvent.click(toggleButton);

    // Update the state and re-render
    includeAnnotations = true;
    mockProps.includeAnnotations = true;
    rerender(<ConfigurationPanel {...mockProps} />);

    // Get the updated button after rerender
    toggleButton = screen.getByRole('button', { name: /analyze components list/i });
    expect(toggleButton).toHaveTextContent('Analyze Components List[ ENABLED ]');

    // Click again to toggle back
    await userEvent.click(toggleButton);

    // Update the state and re-render
    includeAnnotations = false;
    mockProps.includeAnnotations = false;
    rerender(<ConfigurationPanel {...mockProps} />);

    // Get the updated button after rerender
    toggleButton = screen.getByRole('button', { name: /analyze components list/i });
    expect(toggleButton).toHaveTextContent('Analyze Components List[ DISABLED ]');
  });

  test('shows correct annotation button state when enabled', () => {
    const mockProps = {
      style: 'balanced' as const,
      setStyle: vi.fn(),
      includeAnnotations: true,
      setIncludeAnnotations: vi.fn()
    };

    render(<ConfigurationPanel {...mockProps} />);

    const toggleButton = screen.getByRole('button', { name: /analyze components list/i });
    expect(toggleButton).toHaveTextContent('Analyze Components List[ ENABLED ]');
    expect(toggleButton).toHaveClass('bg-slate-900');
    expect(toggleButton).toHaveClass('border-[#C4FF0E]');
    expect(toggleButton).toHaveClass('text-[#C4FF0E]');
  });

  test('shows correct annotation button state when disabled', () => {
    const mockProps = {
      style: 'balanced' as const,
      setStyle: vi.fn(),
      includeAnnotations: false,
      setIncludeAnnotations: vi.fn()
    };

    render(<ConfigurationPanel {...mockProps} />);

    const toggleButton = screen.getByRole('button', { name: /analyze components list/i });
    expect(toggleButton).toHaveTextContent('Analyze Components List[ DISABLED ]');
    expect(toggleButton).toHaveClass('bg-black');
    expect(toggleButton).toHaveClass('border-white/10');
    expect(toggleButton).toHaveClass('text-slate-500');
    expect(toggleButton).toHaveClass('hover:text-white');
  });
});
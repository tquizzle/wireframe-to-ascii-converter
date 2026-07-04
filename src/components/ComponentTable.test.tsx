import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentTable from './ComponentTable';
import { vi } from 'vitest';

describe('ComponentTable', () => {
  const mockConversionResult = {
    asciiLayout: '+------+',
    uiType: 'Login Form',
    layoutSummary: 'A login form with username and password fields',
    detectedComponents: [
      { id: 'comp1', type: 'input', label: 'Username', alignment: 'left' },
      { id: 'comp2', type: 'input', label: 'Password', alignment: 'left' },
      { id: 'comp3', type: 'button', label: 'Login', alignment: 'center' }
    ],
    llmPromptReady: 'Create a login form with username and password fields'
  };

  const mockProps = {
    conversionResult: mockConversionResult,
    copiedPrompt: false,
    onCopyPrompt: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without errors', () => {
    render(<ComponentTable {...mockProps} />);
    expect(screen.getByText('Parsed Components & Structure')).toBeInTheDocument();
  });

  test('displays layout summary correctly', () => {
    render(<ComponentTable {...mockProps} />);
    expect(screen.getByText('Summary:')).toBeInTheDocument();
    expect(screen.getByText('A login form with username and password fields')).toBeInTheDocument();
  });

  test('renders component table when detectedComponents exist', () => {
    render(<ComponentTable {...mockProps} />);

    // Check table headers
    expect(screen.getByText('Component ID')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Label Context')).toBeInTheDocument();
    expect(screen.getByText('Alignment')).toBeInTheDocument();

    // Check component rows by looking at specific table rows
    // First row - Username input
    const firstRow = document.querySelector('tbody tr:nth-child(1)');
    expect(firstRow).toBeInTheDocument();
    expect(firstRow).toHaveTextContent('#comp1');
    expect(firstRow).toHaveTextContent('input');
    expect(firstRow).toHaveTextContent('Username');
    expect(firstRow).toHaveTextContent('left');

    // Second row - Password input
    const secondRow = document.querySelector('tbody tr:nth-child(2)');
    expect(secondRow).toBeInTheDocument();
    expect(secondRow).toHaveTextContent('#comp2');
    expect(secondRow).toHaveTextContent('input');
    expect(secondRow).toHaveTextContent('Password');
    expect(secondRow).toHaveTextContent('left');

    // Third row - Login button
    const thirdRow = document.querySelector('tbody tr:nth-child(3)');
    expect(thirdRow).toBeInTheDocument();
    expect(thirdRow).toHaveTextContent('#comp3');
    expect(thirdRow).toHaveTextContent('button');
    expect(thirdRow).toHaveTextContent('Login');
    expect(thirdRow).toHaveTextContent('center');
  });

  test('shows no components message when detectedComponents is empty', () => {
    const emptyConversionResult = {
      ...mockConversionResult,
      detectedComponents: []
    };

    render(<ComponentTable conversionResult={emptyConversionResult} copiedPrompt={false} onCopyPrompt={vi.fn()} />);

    // Should show the message
    expect(screen.getByText('No structured components detected. Try a different preset or upload.')).toBeInTheDocument();

    // Table should still be rendered (but with message instead of component rows)
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Check that we have a header row and a message row
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2); // header + message row

    // The second row should contain our message
    expect(rows[1]).toHaveTextContent('No structured components detected. Try a different preset or upload.');
  });

  test('disables copy button when already copied', () => {
    const propsWithCopied = {
      ...mockProps,
      copiedPrompt: true
    };

    render(<ComponentTable {...propsWithCopied} />);

    // When copied, button should contain "Copied!" text (not "Copy Full Prompt")
    const copyButton = screen.getByRole('button', { name: /copied/i });
    expect(copyButton).toHaveTextContent('Copied!');
    expect(copyButton).not.toHaveTextContent(/copy full prompt/i);
  });

  test('enables copy button when not copied', () => {
    render(<ComponentTable {...mockProps} />);

    // When not copied, button should contain "Copy Full Prompt" text
    const copyButton = screen.getByRole('button', { name: /copy full prompt/i });
    expect(copyButton).toHaveTextContent('Copy Full Prompt');
    expect(copyButton).not.toHaveTextContent(/copied/i);
  });

  test('calls onCopyPrompt when copy button is clicked', async () => {
    render(<ComponentTable {...mockProps} />);

    // When not copied, button should contain "Copy Full Prompt" text
    const copyButton = screen.getByRole('button', { name: /copy full prompt/i });
    await userEvent.click(copyButton);

    expect(mockProps.onCopyPrompt).toHaveBeenCalledTimes(1);
  });

  test('displays LLM-READY INSTRUCTION PROMPT section', () => {
    render(<ComponentTable {...mockProps} />);

    expect(screen.getByText('LLM-READY INSTRUCTION PROMPT')).toBeInTheDocument();
    expect(screen.getByText('Create a login form with username and password fields')).toBeInTheDocument();
    expect(screen.getByText('*Includes layout guidelines, ascii wireframe, components listing, and structural cues.')).toBeInTheDocument();
  });
});
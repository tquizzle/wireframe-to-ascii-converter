import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputSourcePanel from './InputSourcePanel';
import { vi } from 'vitest';

// Mock the PRESET_WIREFRAMES
vi.mock('../presets', () => ({
  PRESET_WIREFRAMES: [
    { id: 'login', name: 'Login Form', category: 'Auth' },
    { id: 'dashboard', name: 'Dashboard', category: 'Analytics' }
  ]
}));

describe('InputSourcePanel', () => {
  const mockProps = {
    uploadedImage: null,
    selectedPresetId: null,
    isProcessing: false,
    errorMsg: null,
    style: 'balanced' as const,
    setStyle: vi.fn(),
    includeAnnotations: false,
    setIncludeAnnotations: vi.fn(),
    onImageUploaded: vi.fn(),
    onError: vi.fn(),
    onCancel: vi.fn(),
    onConvert: vi.fn(),
    onSelectPreset: vi.fn(),
    onCanvasExport: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders upload mode by default', () => {
    render(<InputSourcePanel {...mockProps} />);
    expect(screen.getByText(/Upload File/i)).toBeInTheDocument();
    expect(screen.getByText(/Sketch Pad/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag & Drop Wireframe Image/i)).toBeInTheDocument();
  });

  test('switches to sketch pad mode when button clicked', async () => {
    render(<InputSourcePanel {...mockProps} />);
    await userEvent.click(screen.getByRole('button', { name: /Sketch Pad/i }));
    expect(screen.getByRole('button', { name: /Convert Sketch to ASCII/i })).toBeInTheDocument();
  });

  test('handles file input button click', async () => {
    render(<InputSourcePanel {...mockProps} />);
    const browseButton = screen.getByRole('button', { name: /Browse Files/i });
    await userEvent.click(browseButton);
    expect(browseButton).toBeInTheDocument();
  });

  test('handles drag and drop area', () => {
    render(<InputSourcePanel {...mockProps} />);
    const dropZone = screen.getByText(/Drag & Drop Wireframe Image/i);
    expect(dropZone).toBeInTheDocument();
  });

  test('loads preset when button clicked', async () => {
    render(<InputSourcePanel {...mockProps} />);
    const presetButton = screen.getByRole('button', { name: /Load Preset/i });
    expect(presetButton).toBeInTheDocument();
    await userEvent.click(presetButton);
    expect(mockProps.onSelectPreset).toHaveBeenCalled();
    expect(mockProps.onSelectPreset).toHaveBeenCalledWith('login');
  });

  test('displays selected preset info when image uploaded', () => {
    render(<InputSourcePanel
      {...mockProps}
      uploadedImage="data:image/png;base64,test"
      selectedPresetId="login"
    />);
    expect(screen.getByText(/Preset: Login Form/i)).toBeInTheDocument();
  });

  test('shows uploaded image preview when image provided', () => {
    render(<InputSourcePanel
      {...mockProps}
      uploadedImage="data:image/png;base64,test"
    />);
    expect(screen.getByRole('img', { name: /uploaded wireframe mockup/i })).toHaveAttribute('src', 'data:image/png;base64,test');
  });

  test('disables convert button when processing', () => {
    render(<InputSourcePanel
      {...mockProps}
      uploadedImage="data:image/png;base64,test"
      isProcessing={true}
    />);
    expect(screen.getByRole('button', { name: /Re-Convert/i })).toBeDisabled();
  });

  test('enables convert button when not processing', () => {
    render(<InputSourcePanel
      {...mockProps}
      uploadedImage="data:image/png;base64,test"
      isProcessing={false}
    />);
    expect(screen.getByRole('button', { name: /Re-Convert/i })).not.toBeDisabled();
  });

  test('calls onConvert when convert button clicked', async () => {
    render(<InputSourcePanel
      {...mockProps}
      uploadedImage="data:image/png;base64,test"
    />);
    await userEvent.click(screen.getByRole('button', { name: /Re-Convert/i }));
    expect(mockProps.onConvert).toHaveBeenCalled();
  });

  test('shows error message when present', () => {
    render(<InputSourcePanel
      {...mockProps}
      errorMsg="Invalid image format"
    />);
    expect(screen.getByText(/CONVERSION ERROR:/i)).toBeInTheDocument();
    expect(screen.getByText(/Invalid image format/)).toBeInTheDocument();
  });

  test('hides error message when null', () => {
    render(<InputSourcePanel
      {...mockProps}
      errorMsg={null}
    />);
    expect(screen.queryByText(/CONVERSION ERROR:/i)).not.toBeInTheDocument();
  });

  test('shows replace image button when image uploaded', () => {
    render(<InputSourcePanel
      {...mockProps}
      uploadedImage="data:image/png;base64,test"
    />);
    expect(screen.getByRole('button', { name: /Replace Image/i })).toBeInTheDocument();
  });
});
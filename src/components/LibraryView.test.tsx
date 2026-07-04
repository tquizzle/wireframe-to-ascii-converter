import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LibraryView from './LibraryView';
import { vi } from 'vitest';

// Mock the PRESET_WIREFRAMES
vi.mock('../presets', () => ({
  PRESET_WIREFRAMES: [
    {
      id: 'login',
      name: 'Login Form',
      category: 'Auth',
      description: 'A simple login form with email and password fields'
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      category: 'Analytics',
      description: 'A dashboard layout with charts and sidebar navigation'
    }
  ]
}));

describe('LibraryView', () => {
  const mockProps = {
    onLoadPreset: vi.fn(),
    onDirectConvert: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without throwing', () => {
    expect(() => {
      render(<LibraryView {...mockProps} />);
    }).not.toThrow();
  });

  test('renders library title', () => {
    render(<LibraryView {...mockProps} />);
    expect(screen.getByText(/Wireframe Preset Library/i)).toBeInTheDocument();
  });

  test('renders library description', () => {
    render(<LibraryView {...mockProps} />);
    expect(screen.getByText(/Select a pre-designed layout structure/i)).toBeInTheDocument();
  });

  test('renders preset cards', () => {
    render(<LibraryView {...mockProps} />);
    expect(screen.getAllByRole('button', { name: /Load Preset/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Direct Convert/i })).toHaveLength(2);
  });

  test('displays preset information correctly', () => {
    render(<LibraryView {...mockProps} />);

    // Check for exact heading texts to avoid partial matches
    const loginFormHeading = screen.getByRole('heading', {
      level: 3,
      name: /^Login Form$/i
    });
    expect(loginFormHeading).toBeInTheDocument();

    const dashboardHeading = screen.getByRole('heading', {
      level: 3,
      name: /^Dashboard$/i
    });
    expect(dashboardHeading).toBeInTheDocument();

    // Check category badges (these are span elements with specific classes)
    expect(screen.getByText(/^Auth$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Analytics$/i)).toBeInTheDocument();

    // Check descriptions (exact matches to avoid partial word matches)
    expect(screen.getByText(/^A simple login form with email and password fields$/i)).toBeInTheDocument();
    expect(screen.getByText(/^A dashboard layout with charts and sidebar navigation$/i)).toBeInTheDocument();
  });

  test('calls onLoadPreset when load preset button clicked', async () => {
    render(<LibraryView {...mockProps} />);
    const loadButtons = screen.getAllByRole('button', { name: /Load Preset/i });
    await userEvent.click(loadButtons[0]);
    expect(mockProps.onLoadPreset).toHaveBeenCalledWith('login');
  });

  test('calls onDirectConvert when direct convert button clicked', async () => {
    render(<LibraryView {...mockProps} />);
    const convertButtons = screen.getAllByRole('button', { name: /Direct Convert/i });
    await userEvent.click(convertButtons[0]);
    expect(mockProps.onDirectConvert).toHaveBeenCalledWith('login');
  });

  test('preset buttons have correct styling', () => {
    render(<LibraryView {...mockProps} />);

    // Get all buttons
    const allButtons = screen.getAllByRole('button');

    // Find the first "Load Preset" button (should be in the first card)
    const loadButtons = allButtons.filter(button =>
      button.textContent.trim() === 'Load Preset' &&
      button.parentElement?.parentElement?.querySelector('h3')?.textContent.includes('Login Form')
    );

    // Find the first "Direct Convert" button (should be in the first card)
    const convertButtons = allButtons.filter(button =>
      button.textContent.trim() === 'Direct Convert' &&
      button.parentElement?.parentElement?.querySelector('h3')?.textContent.includes('Login Form')
    );

    expect(loadButtons[0]).toHaveClass('bg-white');
    expect(loadButtons[0]).toHaveClass('text-black');
    expect(convertButtons[0]).toHaveClass('bg-[#C4FF0E]');
    expect(convertButtons[0]).toHaveClass('text-black');
  });
});
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  const mockStats = {
    tokens: 1500,
    timeMs: 2500,
    componentsCount: 5
  };

  test('renders without errors', () => {
    render(<Footer hasResult={false} stats={mockStats} />);
    expect(screen.getByText('Engine: gemini-3.5-flash')).toBeInTheDocument();
  });

  test('shows engine status with pulsing dot', () => {
    render(<Footer hasResult={false} stats={mockStats} />);
    const engineStatus = screen.getByText('Engine: gemini-3.5-flash');
    expect(engineStatus).toBeInTheDocument();
    expect(engineStatus).toHaveClass('text-white');
  });

  test('hides stats when hasResult is false', () => {
    render(<Footer hasResult={false} stats={mockStats} />);
    expect(screen.queryByText('Latency:')).not.toBeInTheDocument();
    expect(screen.queryByText('Approx Tokens:')).not.toBeInTheDocument();
    expect(screen.queryByText('Detected Items:')).not.toBeInTheDocument();
  });

  test('shows stats when hasResult is true', () => {
    render(<Footer hasResult={true} stats={mockStats} />);
    expect(screen.getByText('Latency:')).toBeInTheDocument();
    expect(screen.getByText('Approx Tokens:')).toBeInTheDocument();
    expect(screen.getByText('Detected Items:')).toBeInTheDocument();
  });

  test('displays correct latency value', () => {
    render(<Footer hasResult={true} stats={mockStats} />);
    expect(screen.getByText('2.50s')).toBeInTheDocument();
  });

  test('displays correct tokens value', () => {
    render(<Footer hasResult={true} stats={mockStats} />);
    expect(screen.getByText('1500')).toBeInTheDocument();
  });

  test('displays correct components count value', () => {
    render(<Footer hasResult={true} stats={mockStats} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('shows copyright information', () => {
    render(<Footer hasResult={false} stats={mockStats} />);
    expect(screen.getByText('© 2026 WIRE2TXT_SYSTEMS // OFFLINE CACHE OK')).toBeInTheDocument();
  });

  test('formats latency correctly for different values', () => {
    const statsWithDifferentTime = { ...mockStats, timeMs: 1234 };
    render(<Footer hasResult={true} stats={statsWithDifferentTime} />);
    expect(screen.getByText('1.23s')).toBeInTheDocument();
  });

  test('handles zero components count', () => {
    const statsWithZeroComponents = { ...mockStats, componentsCount: 0 };
    render(<Footer hasResult={true} stats={statsWithZeroComponents} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('handles large token count', () => {
    const statsWithLargeTokens = { ...mockStats, tokens: 999999 };
    render(<Footer hasResult={true} stats={statsWithLargeTokens} />);
    expect(screen.getByText('999999')).toBeInTheDocument();
  });
});
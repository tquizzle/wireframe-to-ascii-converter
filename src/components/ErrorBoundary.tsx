import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// React requires a class component for error boundaries: getDerivedStateFromError
// and componentDidCatch have no hook equivalent. The one sanctioned exception to
// the project's functional-components-only rule.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }
      return <DefaultFallback error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}

export function DefaultFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 p-8 m-4 text-center border border-rose-900/40 bg-rose-950/10"
    >
      <p className="text-rose-300 font-bold uppercase tracking-wide text-sm">Something went wrong</p>
      <p className="text-xs text-slate-400 font-mono max-w-md break-words">{error.message}</p>
      <button
        onClick={onReset}
        className="px-4 py-2 border border-[#C4FF0E] text-[#C4FF0E] font-bold uppercase text-[10px] tracking-widest hover:bg-[#C4FF0E] hover:text-black transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

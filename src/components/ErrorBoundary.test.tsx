import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Component } from "react";
import { vi } from "vitest";
import { ErrorBoundary, DefaultFallback } from "./ErrorBoundary";

interface ThrowingChildProps {
  shouldThrow: boolean;
  label?: string;
}

class ThrowingChild extends Component<ThrowingChildProps> {
  render() {
    if (this.props.shouldThrow) throw new Error("kaboom from child");
    return <div>{this.props.label ?? "healthy child"}</div>;
  }
}

describe("ErrorBoundary", () => {
  test("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} label="all good" />
      </ErrorBoundary>
    );
    expect(screen.getByText("all good")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("renders default fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/kaboom from child/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.queryByText("healthy child")).not.toBeInTheDocument();
  });

  test("renders custom fallback render prop when provided", () => {
    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div role="alert">
            <span>custom-fallback:{error.message}</span>
            <button onClick={reset}>Recover</button>
          </div>
        )}
      >
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("custom-fallback:kaboom from child")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recover" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Try Again/i })).not.toBeInTheDocument();
  });

  test("reset clears the error and re-renders children", async () => {
    let shouldThrow = true;
    const ConditionalChild = () => {
      if (shouldThrow) throw new Error("first render fails");
      return <div>recovered state</div>;
    };

    render(
      <ErrorBoundary>
        <ConditionalChild />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();

    shouldThrow = false;
    await userEvent.click(screen.getByRole("button", { name: /Try Again/i }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("recovered state")).toBeInTheDocument();
  });

  test("DefaultFallback renders the error message and reset button", () => {
    const onReset = vi.fn();
    render(<DefaultFallback error={new Error("demo error")} onReset={onReset} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/demo error/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
  });
});

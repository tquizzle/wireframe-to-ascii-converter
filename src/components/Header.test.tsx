import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { vi } from "vitest";

describe("Header", () => {
  test("renders application title", () => {
    render(<Header
      hasImage={false}
      isProcessing={false}
      activeTab="editor"
      onConvert={() => {}}
      onGoToWorkspace={() => {}}
    />);
    // The component uses an h1 for the title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("WIRE2TXT");
  });

  test("renders application description", () => {
    render(<Header
      hasImage={false}
      isProcessing={false}
      activeTab="editor"
      onConvert={() => {}}
      onGoToWorkspace={() => {}}
    />);
    // The description is in a p tag
    const description = screen.getByText(/wireframes into clean/);
    expect(description).toBeInTheDocument();
  });

  test("does not show generate button initially", () => {
    render(<Header
      hasImage={false}
      isProcessing={false}
      activeTab="editor"
      onConvert={() => {}}
      onGoToWorkspace={() => {}}
    />);
    // When hasImage is false, the button should not be in the document
    const button = screen.queryByRole("button", { name: /generate ascii/i });
    expect(button).not.toBeInTheDocument();
  });

  test("enables generate button when image is uploaded", () => {
    render(<Header
      hasImage={true}
      isProcessing={false}
      activeTab="editor"
      onConvert={() => {}}
      onGoToWorkspace={() => {}}
    />);
    const button = screen.getByRole("button", { name: /generate ascii/i });
    expect(button).not.toBeDisabled();
  });

  test("shows go to workspace button when not on editor tab", () => {
    render(<Header
      hasImage={false}
      isProcessing={false}
      activeTab="library"
      onConvert={() => {}}
      onGoToWorkspace={() => {}}
    />);
    const button = screen.getByRole("button", { name: /go to workspace/i });
    expect(button).toBeInTheDocument();
  });

  test("hides go to workspace button when on editor tab", () => {
    render(<Header
      hasImage={false}
      isProcessing={false}
      activeTab="editor"
      onConvert={() => {}}
      onGoToWorkspace={() => {}}
    />);
    const button = screen.queryByRole("button", { name: /go to workspace/i });
    expect(button).not.toBeInTheDocument();
  });

  test("calls onConvert when generate button is clicked", async () => {
    const onConvertMock = vi.fn();
    render(<Header
      hasImage={true}
      isProcessing={false}
      activeTab="editor"
      onConvert={onConvertMock}
      onGoToWorkspace={() => {}}
    />);
    const button = screen.getByRole("button", { name: /generate ascii/i });
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    expect(onConvertMock).toHaveBeenCalledTimes(1);
  });

  test("calls onGoToWorkspace when go to workspace button is clicked", async () => {
    const onGoToWorkspaceMock = vi.fn();
    render(<Header
      hasImage={false}
      isProcessing={false}
      activeTab="library"
      onConvert={() => {}}
      onGoToWorkspace={onGoToWorkspaceMock}
    />);
    const button = screen.getByRole("button", { name: /go to workspace/i });
    await userEvent.click(button);
    expect(onGoToWorkspaceMock).toHaveBeenCalledTimes(1);
  });
});
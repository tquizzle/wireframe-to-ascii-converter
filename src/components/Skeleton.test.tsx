import { render } from "@testing-library/react";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  test("renders a placeholder div with the shimmer class", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("animate-pulse");
  });

  test("is hidden from assistive tech via aria-hidden", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  test("applies the provided className alongside the base classes", () => {
    const { container } = render(<Skeleton className="h-2.5 w-3/4" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-2.5");
    expect(el.className).toContain("w-3/4");
    expect(el.className).toContain("bg-white/5");
  });

  test("defaults to a sensible size when no className is given", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-4");
    expect(el.className).toContain("w-full");
  });
});

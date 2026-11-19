/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import NavigationProgress, {
  FINISH_MS,
  MAX_VISIBLE_MS,
  SHOW_DELAY_MS,
} from "@/components/common/Loader/NavigationProgress";
import { NAVIGATION_START_EVENT } from "@/lib/navigationProgress";

let mockPath = "/";
let mockSearch = "";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath,
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

const start = () =>
  act(() => {
    window.dispatchEvent(new CustomEvent(NAVIGATION_START_EVENT, { detail: { href: "/next" } }));
  });
const advance = (ms: number) => act(() => void jest.advanceTimersByTime(ms));
const bar = () => screen.queryByRole("progressbar", { name: "Loading page" });

describe("NavigationProgress", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockPath = "/";
    mockSearch = "";
  });
  afterEach(() => jest.useRealTimers());

  it("shows nothing until a navigation starts", () => {
    render(<NavigationProgress />);
    expect(bar()).toBeNull();
  });

  it("never flickers for a page that swaps in quickly", () => {
    const { rerender } = render(<NavigationProgress />);
    start();
    advance(SHOW_DELAY_MS - 1);
    mockPath = "/next";
    rerender(<NavigationProgress />);
    advance(SHOW_DELAY_MS);
    expect(bar()).toBeNull();
  });

  it("shows for a slow navigation, then finishes and goes away once the page changes", () => {
    const { rerender } = render(<NavigationProgress />);
    start();
    advance(SHOW_DELAY_MS);
    expect(bar()).toBeInTheDocument();
    expect(bar()).toHaveAttribute("aria-busy", "true");

    mockPath = "/next";
    rerender(<NavigationProgress />);
    expect(bar()).toHaveAttribute("aria-busy", "false"); // filling to the end
    advance(FINISH_MS);
    expect(bar()).toBeNull();
  });

  it("also finishes when only the query changes (e.g. a new search)", () => {
    const { rerender } = render(<NavigationProgress />);
    start();
    advance(SHOW_DELAY_MS);
    mockSearch = "q=plumber";
    rerender(<NavigationProgress />);
    advance(FINISH_MS);
    expect(bar()).toBeNull();
  });

  it("gives up after a while if the navigation never completes", () => {
    render(<NavigationProgress />);
    start();
    advance(SHOW_DELAY_MS);
    expect(bar()).toBeInTheDocument();
    advance(MAX_VISIBLE_MS);
    expect(bar()).toBeNull();
  });

  it("restarts cleanly when a second link is tapped mid-navigation", () => {
    render(<NavigationProgress />);
    start();
    advance(MAX_VISIBLE_MS - 10);
    start(); // the safety timeout restarts too
    advance(SHOW_DELAY_MS + 20);
    expect(bar()).toBeInTheDocument();
  });
});

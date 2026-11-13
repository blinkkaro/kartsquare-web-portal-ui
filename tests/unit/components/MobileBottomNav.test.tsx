/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MobileBottomNav, { isActivePath } from "@/components/common/Nav/components/MobileBottomNav";

const mockReduce = jest.fn(() => false);
jest.mock("framer-motion", () => ({ ...jest.requireActual("framer-motion"), useReducedMotion: () => mockReduce() }));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const Icon = () => <svg data-testid="icon" />;
const ITEMS = [
  { label: "Home", href: "/", icon: <Icon /> },
  { label: "Feed", href: "/cus/feed", icon: <Icon /> },
  { label: "Reels", href: "/cus/reels", icon: <Icon /> },
  { label: "Services", href: "/cus/services-list", icon: <Icon /> },
];

describe("isActivePath", () => {
  it("matches home only on the home page", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/cus/feed", "/")).toBe(false);
  });

  it("matches a tab on its page and on pages beneath it", () => {
    expect(isActivePath("/cus/feed", "/cus/feed")).toBe(true);
    expect(isActivePath("/cus/services-list/abc", "/cus/services-list")).toBe(true);
  });

  it("does not match a sibling that merely starts with the same letters", () => {
    expect(isActivePath("/cus/feedback", "/cus/feed")).toBe(false);
  });
});

describe("MobileBottomNav", () => {
  beforeEach(() => mockReduce.mockReturnValue(false));

  it("keeps every destination, each with its name visible under the icon", () => {
    render(<MobileBottomNav items={ITEMS} currentPath="/" />);
    for (const item of ITEMS) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
      expect(link).toHaveTextContent(item.label);
    }
  });

  it("marks the current page, and only that one", () => {
    render(<MobileBottomNav items={ITEMS} currentPath="/cus/feed" />);
    expect(screen.getByRole("link", { name: "Feed" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("fills the current tab's pill and leaves the others plain, all still labelled", () => {
    mockReduce.mockReturnValue(true); // reduced motion: the final state at once
    render(<MobileBottomNav items={ITEMS} currentPath="/cus/reels" />);
    expect(screen.getByRole("link", { name: "Reels" })).toHaveClass("open");
    expect(screen.getByRole("link", { name: "Feed" })).not.toHaveClass("open");
    expect(screen.getByRole("link", { name: "Feed" })).toHaveTextContent("Feed");
  });

  it("is a labelled navigation landmark", () => {
    render(<MobileBottomNav items={ITEMS} currentPath="/" />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });

  it("marks no tab current on a page that is not one of its destinations", () => {
    render(<MobileBottomNav items={ITEMS} currentPath="/privacy-policy" />);
    expect(screen.queryByRole("link", { current: "page" })).not.toBeInTheDocument();
  });

  it("publishes its height for the Kart AI button and the feed's back-to-top button", () => {
    const { unmount } = render(<MobileBottomNav items={ITEMS} currentPath="/" />);
    expect(document.documentElement.style.getPropertyValue("--mobile-nav-h")).toBe("56px");
    unmount();
    expect(document.documentElement.style.getPropertyValue("--mobile-nav-h")).toBe("");
  });
});

/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import ServiceMarquee from "@/components/pages/home/sections/ServiceMarquee";

const mockServices = jest.fn();
jest.mock("@/hooks/useHomeServices", () => ({ useHomeServices: () => mockServices() }));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const service = (...subs: string[]) => ({ category_id: ["c"], sub_category_name: subs });

describe("ServiceMarquee", () => {
  beforeEach(() => {
    mockServices.mockReturnValue({ services: [service("Electrician"), service("Electrician", "Geyser & Water Heater Repair")] });
  });

  it("lists the services we really have, each as a search link", () => {
    render(<ServiceMarquee />);
    const nav = screen.getByRole("navigation", { name: "Services we cover" });
    expect(within(nav).getByRole("link", { name: /Electrician/ })).toHaveAttribute("href", "/cus/services-list?search=Electrician");
    expect(within(nav).getByRole("link", { name: /Geyser & Water Heater Repair/ })).toBeInTheDocument();
  });

  it("keeps the repeated copy out of the tab order and away from screen readers", () => {
    render(<ServiceMarquee />);
    // links in the hidden copy are not exposed by role (aria-hidden), so only one set is reachable
    expect(screen.getAllByRole("link", { name: /Electrician/ })).toHaveLength(1);
  });

  it("holds its space with a placeholder while the services load, and shows no names yet", () => {
    mockServices.mockReturnValue({ services: [], isLoading: true });
    const { container } = render(<ServiceMarquee />);
    expect(container).not.toBeEmptyDOMElement();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("renders nothing, rather than made-up services, when it has loaded and there are none", () => {
    mockServices.mockReturnValue({ services: [], isLoading: false });
    const { container } = render(<ServiceMarquee />);
    expect(container).toBeEmptyDOMElement();
  });
});

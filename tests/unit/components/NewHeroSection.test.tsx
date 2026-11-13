/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render as rtlRender, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import uiReducer from "@/features/ui/uiSlice";
import userEvent from "@testing-library/user-event";
import NewHeroSection from "@/components/pages/home/sections/NewHeroSection";

const mockPush = jest.fn();
const mockServices = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
jest.mock("@/hooks/useHomeServices", () => ({ useHomeServices: () => mockServices() }));
jest.mock("@/services/search/searchService", () => ({
  searchService: { search: jest.fn().mockResolvedValue({ status: "success", data: { users: [], services: [] } }) },
}));
jest.mock("@/components/common/Nav/components/SearchDropdown", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/pages/home/sections/KartAiPreview", () => ({
  __esModule: true,
  default: () => <div data-testid="kart-ai-preview" />,
}));

const service = (...subs: string[]) => ({ category_id: ["c"], sub_category_name: subs });

let store = configureStore({ reducer: { ui: uiReducer } });
const render = (ui: React.ReactElement) => rtlRender(<Provider store={store}>{ui}</Provider>);

describe("NewHeroSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({ reducer: { ui: uiReducer } });
    mockServices.mockReturnValue({
      services: [service("Electrician"), service("Electrician", "Geyser & Water Heater Repair"), service("Car Repair & Service")],
    });
  });

  it("has one clear headline and a supporting line", () => {
    render(<NewHeroSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Kaam karwana hai? Kartsquare pe dhundo.");
    expect(screen.getByText("Service search karo, ya Kart AI ko apni problem batao.")).toBeInTheDocument();
  });

  it("has no eyebrow line above the headline", () => {
    render(<NewHeroSection />);
    expect(screen.queryByText(/local services/i)).not.toBeInTheDocument();
  });

  it("searches the services list with the typed text, as before", async () => {
    const user = userEvent.setup();
    render(<NewHeroSection />);

    await user.type(screen.getByRole("textbox", { name: "Kaunsi service chahiye?" }), "geyser repair{Enter}");

    expect(mockPush).toHaveBeenCalledWith("/cus/services-list?search=geyser%20repair");
  });

  it("opens the full services list for an empty search", async () => {
    const user = userEvent.setup();
    render(<NewHeroSection />);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(mockPush).toHaveBeenCalledWith("/cus/services-list");
  });

  it("offers winter services we really have as shortcuts, searching for each", () => {
    render(<NewHeroSection />);
    expect(screen.getByRole("link", { name: "Electrician" })).toHaveAttribute("href", "/cus/services-list?search=Electrician");
    expect(screen.getByRole("link", { name: "Geyser & Water Heater Repair" })).toHaveAttribute(
      "href",
      "/cus/services-list?search=Geyser%20%26%20Water%20Heater%20Repair",
    );
  });

  it("does not offer services that are not winter services", () => {
    render(<NewHeroSection />);
    expect(screen.queryByRole("link", { name: "Car Repair & Service" })).not.toBeInTheDocument();
  });

  it("labels the shortcuts as a try-this list, not as trending or popular", () => {
    render(<NewHeroSection />);
    expect(screen.getByText("Try searching")).toBeInTheDocument();
    expect(screen.queryByText(/trending|popular/i)).not.toBeInTheDocument();
  });

  it("shows no shortcuts rather than made-up ones when no winter service exists or services have not loaded", () => {
    mockServices.mockReturnValue({ services: [] });
    render(<NewHeroSection />);
    expect(screen.queryByText("Try searching")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("hints at services we really have in the search field", () => {
    render(<NewHeroSection />);
    expect(screen.getByRole("textbox", { name: "Kaunsi service chahiye?" })).toHaveAttribute("placeholder", "Kaunsi service chahiye?");
  });

  it("has no \"service ka naam nahi pata\" block", () => {
    render(<NewHeroSection />);
    expect(screen.queryByText(/naam nahi pata/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Kart AI se poochho/ })).not.toBeInTheDocument();
  });

  it("renders the Kart AI preview beside the search", () => {
    render(<NewHeroSection />);
    expect(screen.getByTestId("kart-ai-preview")).toBeInTheDocument();
  });
});

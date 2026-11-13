/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import uiReducer from "@/features/ui/uiSlice";
import profileDrawer from "@/features/ui/profileDrawerSlice";
import NewTopPros from "@/components/pages/home/sections/NewTopPros";

const mockPush = jest.fn();
const mockTop = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
jest.mock("@/hooks/useTopSuggestions", () => ({ useTopSuggestions: () => mockTop() }));
jest.mock("@/components/common/Ai/useAILocation", () => ({ useAILocation: () => ({ location: { city: "Jaipur" } }) }));

const render = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: { ui: uiReducer, profileDrawer } as never });
  return rtlRender(<Provider store={store}>{ui}</Provider>);
};

const listing = (over: Record<string, unknown> = {}) => ({
  id: "s1",
  slug: "aijaz-electrical",
  name: "Aijaz Electrical Services",
  description: "Home electrical repairs, wiring, and fan and light installation.",
  price: 0,
  rating: "4.00",
  review_count: 0,
  image_urls: ["https://example.com/a.jpg"],
  provider_id: "p1",
  provider_first_name: "Aijaz",
  provider_last_name: "Ahmed",
  provider_profile_pic: "",
  category_name: ["Home Services"],
  city_town: "Jaipur",
  ...over,
});

describe("NewTopPros cards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTop.mockReturnValue({ servicer: [listing()], provider: [], isLoading: false });
  });

  it("shows the service's name as a heading, with its description and where it is", () => {
    render(<NewTopPros />);
    expect(screen.getByRole("heading", { level: 3, name: "Aijaz Electrical Services" })).toBeVisible();
    expect(screen.getByText(/Home electrical repairs, wiring/)).toBeInTheDocument();
    expect(screen.getByText("Jaipur", { selector: "p" })).toBeInTheDocument();
  });

  it("shows the category on the photo and credits the provider by name", () => {
    render(<NewTopPros />);
    expect(screen.getByText("Home Services")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View Aijaz Ahmed's profile" })).toBeInTheDocument();
    expect(screen.getByText("by Aijaz Ahmed")).toBeInTheDocument();
  });

  it("shows a price only when the listing has one", () => {
    mockTop.mockReturnValue({ servicer: [listing({ price: 1200 })], provider: [], isLoading: false });
    const { unmount } = render(<NewTopPros />);
    expect(screen.getByText("₹1,200")).toBeInTheDocument();
    unmount();

    mockTop.mockReturnValue({ servicer: [listing({ price: 0 })], provider: [], isLoading: false });
    render(<NewTopPros />);
    expect(screen.queryByText(/₹/)).not.toBeInTheDocument();
  });

  it("shows a rating only with at least 3 real reviews", () => {
    mockTop.mockReturnValue({ servicer: [listing({ review_count: 2 })], provider: [], isLoading: false });
    const { unmount } = render(<NewTopPros />);
    expect(screen.queryByText("4.0")).not.toBeInTheDocument();
    unmount();

    mockTop.mockReturnValue({ servicer: [listing({ review_count: 5 })], provider: [], isLoading: false });
    render(<NewTopPros />);
    expect(screen.getByText(/4\.0/)).toBeInTheDocument();
  });

  it("copes with a listing that has no category, no provider name and no description, and invents nothing", () => {
    mockTop.mockReturnValue({
      servicer: [listing({ name: "Siddhart InfoTech Solutions", category_name: [], provider_first_name: null, provider_last_name: null, description: "", city_town: null })],
      provider: [],
      isLoading: false,
    });
    render(<NewTopPros />);
    expect(screen.getByRole("heading", { name: "Siddhart InfoTech Solutions" })).toBeVisible();
    expect(screen.queryByText(/^by /)).not.toBeInTheDocument();
    expect(screen.queryByText(/verified|new on kartsquare/i)).not.toBeInTheDocument();
  });

  it("opens the service page from the button and from the name", async () => {
    const user = userEvent.setup();
    render(<NewTopPros />);
    await user.click(screen.getByRole("button", { name: "View details" }));
    expect(mockPush).toHaveBeenCalledWith("/services/aijaz-electrical");
    await user.click(screen.getByRole("heading", { name: "Aijaz Electrical Services" }));
    expect(mockPush).toHaveBeenCalledTimes(2);
  });

  it("renders nothing when there are no listings", () => {
    mockTop.mockReturnValue({ servicer: [], provider: [], isLoading: false });
    const { container } = render(<NewTopPros />);
    expect(container).toBeEmptyDOMElement();
  });
});

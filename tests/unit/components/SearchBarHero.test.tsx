/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/common/Nav/components/SearchBar";
import { searchService } from "@/services/search/searchService";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("@/services/search/searchService", () => ({ searchService: { search: jest.fn() } }));
jest.mock("@/components/common/Nav/components/SearchDropdown", () => ({
  __esModule: true,
  default: () => <div data-testid="suggestions" />,
}));

const search = searchService.search as jest.Mock;

function Harness({ onSubmit = jest.fn(), variant = "hero" as "hero" | "nav" }) {
  const [value, setValue] = require("react").useState("");
  return (
    <SearchBar
      variant={variant}
      search={value}
      onSearchChange={setValue}
      onSubmit={onSubmit}
      placeholder="Kaunsi service chahiye?"
      label="Kaunsi service chahiye?"
    />
  );
}

describe("SearchBar, hero variant", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    search.mockResolvedValue({ status: "success", data: { users: [], services: [] } });
  });

  it("is a labelled search form, not just a placeholder", () => {
    render(<Harness />);
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Kaunsi service chahiye?" })).toBeInTheDocument();
  });

  it("submits the typed text with Enter", async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<Harness onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox"), "geyser repair{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("geyser repair");
  });

  it("submits with the Search button", async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<Harness onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox"), "plumber");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSubmit).toHaveBeenCalledWith("plumber");
  });

  it("keeps fetching suggestions from the search service as the user types", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Harness />);

    await user.type(screen.getByRole("textbox"), "ac");
    await act(async () => void jest.advanceTimersByTime(300));

    expect(search).toHaveBeenCalledWith("ac", 5, 1);
    expect(screen.getByTestId("suggestions")).toBeInTheDocument();
    jest.useRealTimers();
  });
});

describe("SearchBar, header variant (default)", () => {
  it("is unchanged: a bare input with no form or button", () => {
    render(<Harness variant="nav" />);
    expect(screen.queryByRole("search")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Search" })).not.toBeInTheDocument();
  });
});

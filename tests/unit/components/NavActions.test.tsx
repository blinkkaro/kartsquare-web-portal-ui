/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavActions from "@/components/common/Nav/components/NavActions";

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));
jest.mock("@/contexts/SocketContext", () => ({ useSocket: () => ({ unreadCount: 0 }) }));
jest.mock("@/hooks/useTranslate", () => ({ useTranslate: () => ({ t: (key: string) => key }) }));
jest.mock("@/helper/SecureStorage", () => ({ secureStorage: { getItem: () => null } }));

function renderActions(props: Partial<React.ComponentProps<typeof NavActions>> = {}) {
  const handlers = { onLogin: jest.fn(), onFreeListingClick: jest.fn(), onSearchToggle: jest.fn() };
  render(
    <NavActions
      isAuthenticated={false}
      isMobile
      isTablet={false}
      mode="light"
      profileClick={jest.fn()}
      loginText="login"
      onNotificationToggle={jest.fn()}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
}

describe("NavActions on the home page (homeCompact)", () => {
  it("drops the header search on phones: the hero has the search", () => {
    renderActions({ homeCompact: true });
    expect(screen.queryByRole("button", { name: "search" })).not.toBeInTheDocument();
  });

  it("keeps the business listing icon", async () => {
    const { onFreeListingClick } = renderActions({ homeCompact: true });
    await userEvent.click(screen.getByRole("button", { name: "business listing" }));
    expect(onFreeListingClick).toHaveBeenCalled();
  });

  it("has no extra menu button", () => {
    renderActions({ homeCompact: true });
    expect(screen.queryByRole("button", { name: "More options" })).not.toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("keeps login, with the same behaviour", async () => {
    const { onLogin } = renderActions({ homeCompact: true });
    await userEvent.click(screen.getByRole("button", { name: "login" }));
    expect(onLogin).toHaveBeenCalled();
  });

  it("also applies on tablets", () => {
    renderActions({ homeCompact: true, isMobile: false, isTablet: true });
    expect(screen.queryByRole("button", { name: "search" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "business listing" })).toBeInTheDocument();
  });
});

describe("NavActions on every other page", () => {
  it("still shows the search icon and the business listing icon", () => {
    renderActions();
    expect(screen.getByRole("button", { name: "search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "business listing" })).toBeInTheDocument();
  });

  it("still opens the mobile search", async () => {
    const { onSearchToggle } = renderActions();
    await userEvent.click(screen.getByRole("button", { name: "search" }));
    expect(onSearchToggle).toHaveBeenCalled();
  });
});

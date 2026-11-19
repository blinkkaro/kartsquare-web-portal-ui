/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import PageSkeleton, { type PageSkeletonVariant } from "@/components/common/Loader/PageSkeleton";

// The real shell (header, bottom nav) is covered elsewhere; here it only has to wrap the skeleton.
jest.mock("@/app/mainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="shell">{children}</div>
  ),
}));

describe("PageSkeleton", () => {
  it.each<PageSkeletonVariant>(["detail", "list", "profile"])(
    "renders the %s placeholder inside the normal shell, announced as loading",
    (variant) => {
      render(<PageSkeleton variant={variant} label="Loading service" />);
      const status = screen.getByRole("status", { name: "Loading service" });
      expect(status).toHaveAttribute("aria-busy", "true");
      expect(screen.getByTestId("shell")).toContainElement(status);
      expect(status.childElementCount).toBeGreaterThan(0);
    },
  );

  it("draws a grid of card placeholders for list pages", () => {
    const { container } = render(<PageSkeleton variant="list" label="Loading services" />);
    expect(container.querySelectorAll(".MuiSkeleton-rounded").length).toBeGreaterThanOrEqual(6);
  });
});

/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";

describe("LogoLoader", () => {
  it("announces itself as a loading status", () => {
    render(<LogoLoader />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("shows the 'Hold on' line at the default size", () => {
    render(<LogoLoader />);
    expect(screen.getByText("Hold on !!")).toBeInTheDocument();
  });

  it("drops the text when it is small (inline spinners)", () => {
    render(<LogoLoader size={24} />);
    expect(screen.queryByText("Hold on !!")).toBeNull();
  });

  it("lets the caller force the text on or off", () => {
    const { rerender } = render(<LogoLoader size={24} showText />);
    expect(screen.getByText("Hold on !!")).toBeInTheDocument();
    rerender(<LogoLoader size={80} showText={false} />);
    expect(screen.queryByText("Hold on !!")).toBeNull();
  });

  it("draws its rings at the requested size", () => {
    const { container } = render(<LogoLoader size={40} />);
    const ring = container.querySelector('[role="status"] > div');
    expect(ring).toHaveStyle({ width: "40px", height: "40px" });
  });
});

describe("CenteredLoader", () => {
  it("wraps the same loader", () => {
    render(<CenteredLoader />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });
});

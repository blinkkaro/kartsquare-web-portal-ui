/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/pages/home/sections/shared";

describe("SectionHeader", () => {
  it("shows the title as a level-2 heading, with its subtitle", () => {
    render(<SectionHeader title="Trusted professionals near you" subtitle="Listed on Kartsquare in Jaipur" />);
    expect(screen.getByRole("heading", { level: 2, name: "Trusted professionals near you" })).toBeInTheDocument();
    expect(screen.getByText("Listed on Kartsquare in Jaipur")).toBeInTheDocument();
  });

  it("on a dark band, the heading and subtitle turn light so they stay readable", () => {
    render(<SectionHeader onDark title="Trusted professionals near you" subtitle="Listed on Kartsquare in Jaipur" />);
    expect(screen.getByRole("heading", { name: "Trusted professionals near you" })).toHaveStyle({ color: "rgb(255, 255, 255)" });
    expect(screen.getByText("Listed on Kartsquare in Jaipur")).toHaveStyle({ color: "rgba(255, 255, 255, 0.8)" });
  });

  it("keeps the action", () => {
    render(<SectionHeader title="T" action={<button type="button">See all</button>} />);
    expect(screen.getByRole("button", { name: "See all" })).toBeInTheDocument();
  });
});

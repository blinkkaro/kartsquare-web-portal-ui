/**
 * @jest-environment jsdom
 *
 * Unit test pattern for a component: render it, assert what a user (or screen reader) gets, not
 * the markup. The icon is decorative, so the contract is "hidden from assistive tech" and
 * "coloured by the category".
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import CategoryIcon, { categoryTint, sameOrigin } from "@/components/common/CategoryIcon";

describe("CategoryIcon", () => {
  it("is hidden from assistive tech: the category name is always shown beside it", () => {
    const { container } = render(<CategoryIcon icon="ph:tractor-duotone" size={24} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("draws an svg, falling back to the default icon for an unknown name", () => {
    const { container } = render(<CategoryIcon icon="ph:not-a-real-icon" size={24} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("wraps the icon in a tile when a tile size is given", () => {
    const { container } = render(<CategoryIcon icon="ph:car-duotone" color="#ea580c" size={20} tile={40} />);
    const tile = container.firstElementChild as HTMLElement;
    expect(tile).toHaveStyle({ width: "40px", height: "40px" });
  });
});

describe("categoryTint", () => {
  it("adds ~15% alpha to a valid #rrggbb colour", () => {
    expect(categoryTint("#7c3aed")).toBe("#7c3aed26");
  });

  it("uses the brand tint when the colour is missing or malformed", () => {
    expect(categoryTint(null)).toBe(categoryTint("not-a-colour"));
  });
});

describe("sameOrigin", () => {
  it("turns a kartsquare.com asset URL into a path on this deploy", () => {
    expect(sameOrigin("https://www.kartsquare.com/images/x.jpg")).toBe("/images/x.jpg");
  });

  it("leaves other hosts untouched", () => {
    expect(sameOrigin("https://res.cloudinary.com/a/b.webp")).toBe("https://res.cloudinary.com/a/b.webp");
  });

  it("returns null for empty input", () => {
    expect(sameOrigin("")).toBeNull();
  });
});

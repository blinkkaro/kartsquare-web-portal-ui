/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LikeButton, { AnimatedCount, DoubleTapHeart } from "@/components/pages/feed/sections/LikeButton";

const mockReduce = jest.fn(() => false);
jest.mock("framer-motion", () => ({ ...jest.requireActual("framer-motion"), useReducedMotion: () => mockReduce() }));

describe("LikeButton", () => {
  beforeEach(() => mockReduce.mockReturnValue(false));

  it("says whether the post is liked, for screen readers", () => {
    const { rerender } = render(<LikeButton liked={false} onToggle={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute("aria-pressed", "false");
    rerender(<LikeButton liked onToggle={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Unlike" })).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onToggle on every press, liking and unliking", async () => {
    const onToggle = jest.fn();
    render(<LikeButton liked={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: "Like" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("does not spray sparks for a post that was already liked when it appeared", () => {
    const { container } = render(<LikeButton liked onToggle={jest.fn()} />);
    expect(container.querySelectorAll('[aria-hidden="true"] span').length).toBe(0);
  });

  it("sparks when a like is pressed, and not under reduced motion", async () => {
    const { container, rerender } = render(<LikeButton liked={false} onToggle={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Like" }));
    rerender(<LikeButton liked onToggle={jest.fn()} />);
    expect(container.querySelectorAll('span[aria-hidden="true"] > span').length).toBe(6);

    mockReduce.mockReturnValue(true);
    const reduced = render(<LikeButton liked={false} onToggle={jest.fn()} />);
    await userEvent.click(reduced.getAllByRole("button", { name: "Like" })[0]);
    reduced.rerender(<LikeButton liked onToggle={jest.fn()} />);
    expect(reduced.container.querySelectorAll('span[aria-hidden="true"] > span').length).toBe(0);
  });
});

describe("DoubleTapHeart", () => {
  it("shows nothing until the first double-tap, and never under reduced motion", () => {
    mockReduce.mockReturnValue(false);
    const { container, rerender } = render(<DoubleTapHeart trigger={0} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<DoubleTapHeart trigger={1} />);
    expect(container.firstChild).not.toBeNull();

    mockReduce.mockReturnValue(true);
    const reduced = render(<DoubleTapHeart trigger={1} />);
    expect(reduced.container).toBeEmptyDOMElement();
  });
});

describe("AnimatedCount", () => {
  it("shows the number, formatted for India", () => {
    mockReduce.mockReturnValue(false);
    render(<AnimatedCount value={12345} />);
    expect(screen.getByText("12,345")).toBeInTheDocument();
  });
});

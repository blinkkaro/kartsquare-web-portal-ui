/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedTabs from "@/components/pages/feed/sections/FeedTabs";

const TABS = [
  { id: "for_you", label: "For you" },
  { id: "posts", label: "Posts" },
  { id: "reels", label: "Reels" },
] as const;

function setup(value: (typeof TABS)[number]["id"] = "for_you", trailing?: React.ReactNode) {
  const onChange = jest.fn();
  render(<FeedTabs tabs={TABS} value={value} onChange={onChange} ariaLabel="Feed" trailing={trailing} />);
  return onChange;
}

describe("FeedTabs", () => {
  it("is a tablist with the selected tab marked", () => {
    setup("posts");
    expect(screen.getByRole("tablist", { name: "Feed" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Posts" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "For you" })).toHaveAttribute("aria-selected", "false");
  });

  it("selects a tab on click", async () => {
    const onChange = setup();
    await userEvent.click(screen.getByRole("tab", { name: "Reels" }));
    expect(onChange).toHaveBeenCalledWith("reels");
  });

  it("only the selected tab is in the tab order", () => {
    setup("posts");
    expect(screen.getByRole("tab", { name: "Posts" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Reels" })).toHaveAttribute("tabindex", "-1");
  });

  it("moves with the arrow keys, wrapping at both ends, and Home and End jump", async () => {
    const onChange = setup("for_you");
    screen.getByRole("tab", { name: "For you" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith("posts");
    await userEvent.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenLastCalledWith("reels"); // wraps from the first to the last
    await userEvent.keyboard("{End}");
    expect(onChange).toHaveBeenLastCalledWith("reels");
    await userEvent.keyboard("{Home}");
    expect(onChange).toHaveBeenLastCalledWith("for_you");
  });

  it("points each tab at the panel it controls", () => {
    setup();
    expect(screen.getByRole("tab", { name: "Posts" })).toHaveAttribute("aria-controls", "feed-panel");
  });

  it("renders the trailing control (the phone create button) beside the tabs", () => {
    setup("for_you", <button type="button">Create a post</button>);
    expect(screen.getByRole("button", { name: "Create a post" })).toBeInTheDocument();
  });
});

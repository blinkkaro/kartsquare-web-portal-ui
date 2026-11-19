/**
 * @jest-environment jsdom
 */
import {
  announceNavigationStart,
  isPageChange,
  NAVIGATION_START_EVENT,
} from "@/lib/navigationProgress";

describe("isPageChange", () => {
  const here = "https://www.kartsquare.com/services/jaipur/ac-repair?sort=new#reviews";

  it("is a change when the path differs", () => {
    expect(isPageChange("/about-us", here)).toBe(true);
  });

  it("is a change when only the query differs", () => {
    expect(isPageChange("/services/jaipur/ac-repair?sort=old", here)).toBe(true);
  });

  it("is not a change for the page already open", () => {
    expect(isPageChange("/services/jaipur/ac-repair?sort=new", here)).toBe(false);
  });

  it("is not a change for a hash-only jump (the bar would never finish)", () => {
    expect(isPageChange("#faq", here)).toBe(false);
    expect(isPageChange("/services/jaipur/ac-repair?sort=new#faq", here)).toBe(false);
  });

  it("is not a change for another origin", () => {
    expect(isPageChange("https://example.com/about-us", here)).toBe(false);
  });

  it("resolves relative links against the current page", () => {
    expect(isPageChange("../bangalore", "https://www.kartsquare.com/services/jaipur/x")).toBe(true);
  });

  it("treats an unparsable current URL as no change", () => {
    expect(isPageChange("/x", "not a url")).toBe(false);
  });
});

describe("announceNavigationStart", () => {
  const listener = jest.fn();
  beforeEach(() => {
    listener.mockClear();
    window.history.replaceState(null, "", "/blogs");
    window.addEventListener(NAVIGATION_START_EVENT, listener);
  });
  afterEach(() => window.removeEventListener(NAVIGATION_START_EVENT, listener));

  it("announces a navigation to another page, with its target", () => {
    announceNavigationStart("/about-us");
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ href: "/about-us" });
  });

  it("stays silent for the page already open", () => {
    announceNavigationStart("/blogs");
    expect(listener).not.toHaveBeenCalled();
  });
});

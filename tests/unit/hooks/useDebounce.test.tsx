/**
 * @jest-environment jsdom
 *
 * Unit test pattern for a hook: `renderHook`, fake timers, `act` around anything that moves time.
 * The docblock above (first comment in the file) switches this file to jsdom.
 */
import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("jaipur", 300));
    expect(result.current).toBe("jaipur");
  });

  it("keeps the old value until the delay has passed", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe("ab");
  });

  it("restarts the timer on every change, so only the last value lands", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    act(() => jest.advanceTimersByTime(200));
    rerender({ value: "abc" });
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe("abc");
  });
});

/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { useLazyMount, usePrefetchWhenIdle } from "@/hooks/useLazyMount";

describe("useLazyMount", () => {
  it("is false while the overlay has never been opened", () => {
    const { result } = renderHook(() => useLazyMount(false));
    expect(result.current).toBe(false);
  });

  it("turns true on first open and stays true after closing, so the close animation can play", () => {
    const { result, rerender } = renderHook(({ open }) => useLazyMount(open), {
      initialProps: { open: false },
    });
    rerender({ open: true });
    expect(result.current).toBe(true);
    rerender({ open: false });
    expect(result.current).toBe(true);
  });

  it("is true straight away when it starts open", () => {
    const { result } = renderHook(() => useLazyMount(true));
    expect(result.current).toBe(true);
  });
});

describe("usePrefetchWhenIdle", () => {
  // Our own view of the global, so tests can install and remove requestIdleCallback freely.
  const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };

  afterEach(() => {
    delete w.requestIdleCallback;
    jest.useRealTimers();
  });

  it("runs every loader once the browser is idle", () => {
    w.requestIdleCallback = (cb) => {
      cb();
      return 1;
    };
    const a = jest.fn(() => Promise.resolve());
    const b = jest.fn(() => Promise.resolve());
    renderHook(() => usePrefetchWhenIdle([a, b]));
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("falls back to a timer where requestIdleCallback is missing (older Safari)", () => {
    jest.useFakeTimers();
    const load = jest.fn(() => Promise.resolve());
    renderHook(() => usePrefetchWhenIdle([load]));
    expect(load).not.toHaveBeenCalled();
    jest.advanceTimersByTime(2500);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("swallows a failed prefetch: the overlay simply loads on open instead", async () => {
    w.requestIdleCallback = (cb) => {
      cb();
      return 1;
    };
    const failing = jest.fn(() => Promise.reject(new Error("offline")));
    expect(() => renderHook(() => usePrefetchWhenIdle([failing]))).not.toThrow();
    await Promise.resolve();
    expect(failing).toHaveBeenCalled();
  });

  it("does nothing if unmounted before the browser was idle", () => {
    jest.useFakeTimers();
    const load = jest.fn(() => Promise.resolve());
    const { unmount } = renderHook(() => usePrefetchWhenIdle([load]));
    unmount();
    jest.advanceTimersByTime(5000);
    expect(load).not.toHaveBeenCalled();
  });
});

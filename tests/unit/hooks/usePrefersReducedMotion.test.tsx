/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Listener = () => void;

function installMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<Listener>();
  window.matchMedia = jest.fn().mockImplementation(() => ({
    get matches() {
      return matches;
    },
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
  }));
  return {
    set(next: boolean) {
      matches = next;
      listeners.forEach((l) => l());
    },
    listenerCount: () => listeners.size,
  };
}

describe("usePrefersReducedMotion", () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it("is false when the user has not asked for reduced motion", () => {
    installMatchMedia(false);
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(false);
  });

  it("is true when the OS asks for reduced motion (e.g. Android battery saver)", () => {
    installMatchMedia(true);
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(true);
  });

  it("follows the setting when it changes, and stops listening on unmount", () => {
    const media = installMatchMedia(false);
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());
    act(() => media.set(true));
    expect(result.current).toBe(true);
    unmount();
    expect(media.listenerCount()).toBe(0);
  });

  it("is false where matchMedia does not exist (very old WebViews, jsdom)", () => {
    // @ts-expect-error simulating a browser without matchMedia
    delete window.matchMedia;
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(false);
  });
});

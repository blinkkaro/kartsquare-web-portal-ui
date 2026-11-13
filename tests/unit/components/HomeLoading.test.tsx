/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomeLoadingBar, KartLoadingNote, ShimmerBox } from "@/components/pages/home/sections/HomeLoading";

describe("ShimmerBox", () => {
  it("is decoration: hidden from assistive tech", () => {
    const { container } = render(<ShimmerBox sx={{ height: 20 }} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("KartLoadingNote", () => {
  it("says what is loading, in Kartsquare's voice, as a status message", () => {
    const { getByRole } = render(<KartLoadingNote />);
    expect(getByRole("status")).toHaveTextContent("Aapke liye services dhoondh rahe hain");
  });
});

describe("HomeLoadingBar", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const bar = (host: HTMLElement) => host.querySelector('[aria-hidden="true"]');

  it("stays out of the way of a fast load, then shows, then lingers briefly so it never flickers", async () => {
    const client = new QueryClient();
    const { getByTestId } = render(
      <QueryClientProvider client={client}>
        <div data-testid="host">
          <HomeLoadingBar />
        </div>
      </QueryClientProvider>,
    );
    const host = getByTestId("host");
    expect(bar(host)).toBeNull();

    let finish: () => void = () => undefined;
    act(() => {
      void client.fetchQuery({ queryKey: ["slow"], queryFn: () => new Promise<void>((resolve) => (finish = resolve)) });
    });

    act(() => void jest.advanceTimersByTime(149));
    expect(bar(host)).toBeNull(); // not yet: a fast load would never have shown it
    act(() => void jest.advanceTimersByTime(1));
    expect(bar(host)).not.toBeNull();

    await act(async () => finish());
    act(() => void jest.advanceTimersByTime(499));
    expect(bar(host)).not.toBeNull(); // lingers a moment after the data arrives
    act(() => void jest.advanceTimersByTime(1));
    expect(bar(host)).toBeNull();
  });
});
